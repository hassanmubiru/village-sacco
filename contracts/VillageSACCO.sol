// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract VillageSACCO is ERC20, ReentrancyGuard, AccessControl, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MEMBER_ROLE = keccak256("MEMBER_ROLE");
    
    // Events
    event MemberRegistered(address indexed member, string name, uint256 timestamp);
    event MemberApproved(address indexed member, address indexed approver, uint256 timestamp);
    event SavingsDeposited(address indexed member, uint256 amount, uint256 timestamp);
    event SavingsWithdrawn(address indexed member, uint256 amount, uint256 timestamp);
    event LoanRequested(address indexed member, uint256 amount, uint256 interestRate, uint256 duration, string purpose);
    event LoanApproved(address indexed member, uint256 loanId, address indexed approver);
    event LoanDisbursed(address indexed member, uint256 loanId, uint256 amount);
    event LoanRepaid(address indexed member, uint256 loanId, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, string title, address indexed proposer);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool vote);
    event ProposalExecuted(uint256 indexed proposalId, bool passed);
    
    // Structs
    struct Member {
        string name;
        string email;
        bool isApproved;
        bool exists;
        uint256 totalSavings;
        uint256 totalLoansAmount;
        uint256 registrationDate;
    }
    
    struct Loan {
        address borrower;
        uint256 amount;
        uint256 interestRate; // Basis points (e.g., 500 = 5%)
        uint256 duration; // in months
        string purpose;
        bool isApproved;
        bool isDisbursed;
        bool isRepaid;
        uint256 totalRepaid;
        uint256 requestDate;
        uint256 approvalDate;
        uint256 disbursementDate;
    }
    
    struct Proposal {
        string title;
        string description;
        address proposer;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 creationTime;
        uint256 votingDeadline;
        bool executed;
        bool passed;
        mapping(address => bool) hasVoted;
    }
    
    // State variables
    mapping(address => Member) public members;
    mapping(uint256 => Loan) public loans;
    mapping(uint256 => Proposal) public proposals;
    
    address[] public membersList;
    uint256 public nextLoanId;
    uint256 public nextProposalId;
    uint256 public totalPoolFunds;
    uint256 public minimumSavings = 10 * 10**18; // 10 tokens minimum
    uint256 public votingPeriod = 7 days;
    
    // Modifiers
    modifier onlyApprovedMember() {
        require(members[msg.sender].exists && members[msg.sender].isApproved, "Not an approved member");
        _;
    }
    
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Admin access required");
        _;
    }
    
    constructor(
        string memory name,
        string memory symbol,
        address initialAdmin
    ) ERC20(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(ADMIN_ROLE, initialAdmin);
    }
    
    // Member Management Functions
    function registerMember(
        string memory _name,
        string memory _email
    ) external {
        require(!members[msg.sender].exists, "Member already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        
        members[msg.sender] = Member({
            name: _name,
            email: _email,
            isApproved: false,
            exists: true,
            totalSavings: 0,
            totalLoansAmount: 0,
            registrationDate: block.timestamp
        });
        
        membersList.push(msg.sender);
        emit MemberRegistered(msg.sender, _name, block.timestamp);
    }
    
    function approveMember(address _member) external onlyAdmin {
        require(members[_member].exists, "Member does not exist");
        require(!members[_member].isApproved, "Member already approved");
        
        members[_member].isApproved = true;
        _grantRole(MEMBER_ROLE, _member);
        
        emit MemberApproved(_member, msg.sender, block.timestamp);
    }
    
    // Savings Management Functions
    function depositSavings() external payable onlyApprovedMember nonReentrant {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        members[msg.sender].totalSavings += msg.value;
        totalPoolFunds += msg.value;
        
        // Mint SACCO tokens equivalent to savings
        _mint(msg.sender, msg.value);
        
        emit SavingsDeposited(msg.sender, msg.value, block.timestamp);
    }
    
    function withdrawSavings(uint256 _amount) external onlyApprovedMember nonReentrant {
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(_amount <= members[msg.sender].totalSavings, "Insufficient savings balance");
        require(_amount <= address(this).balance, "Insufficient contract balance");
        require(balanceOf(msg.sender) >= _amount, "Insufficient token balance");
        
        members[msg.sender].totalSavings -= _amount;
        totalPoolFunds -= _amount;
        
        // Burn SACCO tokens
        _burn(msg.sender, _amount);
        
        // Transfer ETH back to member
        payable(msg.sender).transfer(_amount);
        
        emit SavingsWithdrawn(msg.sender, _amount, block.timestamp);
    }
    
    // Loan Management Functions
    function requestLoan(
        uint256 _amount,
        uint256 _interestRate,
        uint256 _duration,
        string memory _purpose
    ) external onlyApprovedMember {
        require(_amount > 0, "Loan amount must be greater than 0");
        require(_amount <= totalPoolFunds / 2, "Loan amount exceeds available funds");
        require(_duration > 0 && _duration <= 60, "Invalid loan duration");
        require(bytes(_purpose).length > 0, "Purpose cannot be empty");
        require(members[msg.sender].totalSavings >= minimumSavings, "Insufficient savings for loan eligibility");
        
        loans[nextLoanId] = Loan({
            borrower: msg.sender,
            amount: _amount,
            interestRate: _interestRate,
            duration: _duration,
            purpose: _purpose,
            isApproved: false,
            isDisbursed: false,
            isRepaid: false,
            totalRepaid: 0,
            requestDate: block.timestamp,
            approvalDate: 0,
            disbursementDate: 0
        });
        
        emit LoanRequested(msg.sender, _amount, _interestRate, _duration, _purpose);
        nextLoanId++;
    }
    
    function approveLoan(uint256 _loanId) external onlyAdmin {
        require(_loanId < nextLoanId, "Loan does not exist");
        require(!loans[_loanId].isApproved, "Loan already approved");
        require(loans[_loanId].amount <= address(this).balance, "Insufficient contract balance");
        
        loans[_loanId].isApproved = true;
        loans[_loanId].approvalDate = block.timestamp;
        
        emit LoanApproved(loans[_loanId].borrower, _loanId, msg.sender);
    }
    
    function disburseLoan(uint256 _loanId) external onlyAdmin nonReentrant {
        require(_loanId < nextLoanId, "Loan does not exist");
        require(loans[_loanId].isApproved, "Loan not approved");
        require(!loans[_loanId].isDisbursed, "Loan already disbursed");
        require(loans[_loanId].amount <= address(this).balance, "Insufficient contract balance");
        
        Loan storage loan = loans[_loanId];
        loan.isDisbursed = true;
        loan.disbursementDate = block.timestamp;
        
        members[loan.borrower].totalLoansAmount += loan.amount;
        totalPoolFunds -= loan.amount;
        
        // Transfer loan amount to borrower
        payable(loan.borrower).transfer(loan.amount);
        
        emit LoanDisbursed(loan.borrower, _loanId, loan.amount);
    }
    
    function repayLoan(uint256 _loanId) external payable nonReentrant {
        require(_loanId < nextLoanId, "Loan does not exist");
        require(loans[_loanId].borrower == msg.sender, "Not the borrower");
        require(loans[_loanId].isDisbursed, "Loan not disbursed");
        require(!loans[_loanId].isRepaid, "Loan already repaid");
        require(msg.value > 0, "Repayment amount must be greater than 0");
        
        Loan storage loan = loans[_loanId];
        loan.totalRepaid += msg.value;
        totalPoolFunds += msg.value;
        
        // Calculate total amount due (principal + interest)
        uint256 totalDue = loan.amount + (loan.amount * loan.interestRate / 10000);
        
        if (loan.totalRepaid >= totalDue) {
            loan.isRepaid = true;
            members[msg.sender].totalLoansAmount -= loan.amount;
        }
        
        emit LoanRepaid(msg.sender, _loanId, msg.value);
    }
    
    // Governance Functions
    function createProposal(
        string memory _title,
        string memory _description
    ) external onlyApprovedMember returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        
        uint256 proposalId = nextProposalId;
        Proposal storage newProposal = proposals[proposalId];
        
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.proposer = msg.sender;
        newProposal.creationTime = block.timestamp;
        newProposal.votingDeadline = block.timestamp + votingPeriod;
        newProposal.executed = false;
        newProposal.passed = false;
        
        emit ProposalCreated(proposalId, _title, msg.sender);
        nextProposalId++;
        
        return proposalId;
    }
    
    function vote(uint256 _proposalId, bool _vote) external onlyApprovedMember {
        require(_proposalId < nextProposalId, "Proposal does not exist");
        require(block.timestamp < proposals[_proposalId].votingDeadline, "Voting period ended");
        require(!proposals[_proposalId].hasVoted[msg.sender], "Already voted");
        
        Proposal storage proposal = proposals[_proposalId];
        proposal.hasVoted[msg.sender] = true;
        
        if (_vote) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }
        
        emit VoteCast(_proposalId, msg.sender, _vote);
    }
    
    function executeProposal(uint256 _proposalId) external onlyAdmin {
        require(_proposalId < nextProposalId, "Proposal does not exist");
        require(block.timestamp >= proposals[_proposalId].votingDeadline, "Voting period not ended");
        require(!proposals[_proposalId].executed, "Proposal already executed");
        
        Proposal storage proposal = proposals[_proposalId];
        proposal.executed = true;
        
        if (proposal.yesVotes > proposal.noVotes) {
            proposal.passed = true;
        }
        
        emit ProposalExecuted(_proposalId, proposal.passed);
    }
    
    // View Functions
    function getMemberInfo(address _member) external view returns (
        string memory name,
        string memory email,
        bool isApproved,
        uint256 totalSavings,
        uint256 totalLoansAmount,
        uint256 registrationDate
    ) {
        Member memory member = members[_member];
        return (
            member.name,
            member.email,
            member.isApproved,
            member.totalSavings,
            member.totalLoansAmount,
            member.registrationDate
        );
    }
    
    function getLoanInfo(uint256 _loanId) external view returns (
        address borrower,
        uint256 amount,
        uint256 interestRate,
        uint256 duration,
        string memory purpose,
        bool isApproved,
        bool isDisbursed,
        bool isRepaid,
        uint256 totalRepaid
    ) {
        Loan memory loan = loans[_loanId];
        return (
            loan.borrower,
            loan.amount,
            loan.interestRate,
            loan.duration,
            loan.purpose,
            loan.isApproved,
            loan.isDisbursed,
            loan.isRepaid,
            loan.totalRepaid
        );
    }
    
    function getProposalInfo(uint256 _proposalId) external view returns (
        string memory title,
        string memory description,
        address proposer,
        uint256 yesVotes,
        uint256 noVotes,
        uint256 votingDeadline,
        bool executed,
        bool passed
    ) {
        Proposal memory proposal = proposals[_proposalId];
        return (
            proposal.title,
            proposal.description,
            proposal.proposer,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.votingDeadline,
            proposal.executed,
            proposal.passed
        );
    }
    
    function getTotalMembers() external view returns (uint256) {
        return membersList.length;
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Admin Functions
    function setMinimumSavings(uint256 _amount) external onlyAdmin {
        minimumSavings = _amount;
    }
    
    function setVotingPeriod(uint256 _period) external onlyAdmin {
        votingPeriod = _period;
    }
    
    function pause() external onlyAdmin {
        _pause();
    }
    
    function unpause() external onlyAdmin {
        _unpause();
    }
    
    // Emergency withdrawal function (only for admin)
    function emergencyWithdraw() external onlyAdmin {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    // Override required by Solidity
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}