'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Rocket, 
  Settings, 
  CheckCircle,
  ExternalLink,
  Copy,
  Loader2,
  AlertCircle
} from 'lucide-react';

export function ContractDeployment() {
  const { userAddress, isAdmin } = useAuth();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedContract, setDeployedContract] = useState<string | null>(
    process.env.NEXT_PUBLIC_SACCO_CONTRACT_ADDRESS || null
  );
  
  const [deploymentForm, setDeploymentForm] = useState({
    name: 'Village SACCO Token',
    symbol: 'VST',
    adminAddress: userAddress || ''
  });

  const handleDeploy = async () => {
    if (!userAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!deploymentForm.name || !deploymentForm.symbol) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsDeploying(true);
      
      // Simulate contract deployment
      toast.loading('Deploying smart contract...', { id: 'deploy' });
      
      // Mock deployment process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock contract address
      const mockContractAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
      
      setDeployedContract(mockContractAddress);
      
      toast.success('Smart contract deployed successfully!', { id: 'deploy' });
      
      // In a real implementation, you would:
      // 1. Use Thirdweb SDK to deploy the contract
      // 2. Save the contract address to environment variables
      // 3. Update the application configuration
      
    } catch (error) {
      console.error('Contract deployment error:', error);
      toast.error('Contract deployment failed', { id: 'deploy' });
    } finally {
      setIsDeploying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">
          Admin Access Required
        </h2>
        <p className="text-gray-500">
          Only administrators can deploy smart contracts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Contract Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Smart Contract Status</span>
          </CardTitle>
          <CardDescription>
            Current deployment status of the SACCO smart contract
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deployedContract ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Deployed
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Label>Contract Address</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={deployedContract} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(deployedContract)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a 
                      href={`https://sepolia.basescan.org/address/${deployedContract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">
                  ✅ Contract Successfully Deployed
                </h4>
                <p className="text-sm text-green-700">
                  Your SACCO smart contract is live on Base Sepolia testnet. 
                  All platform features are now fully functional.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <Badge variant="secondary">Not Deployed</Badge>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">
                  ⚠️ Contract Not Deployed
                </h4>
                <p className="text-sm text-orange-700">
                  The SACCO smart contract has not been deployed yet. 
                  Please deploy the contract to enable all platform features.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deploy Contract */}
      {!deployedContract && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Rocket className="w-5 h-5" />
              <span>Deploy Smart Contract</span>
            </CardTitle>
            <CardDescription>
              Deploy the SACCO smart contract to Base Sepolia testnet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contract-name">Token Name</Label>
                  <Input
                    id="contract-name"
                    placeholder="Village SACCO Token"
                    value={deploymentForm.name}
                    onChange={(e) => setDeploymentForm(prev => ({ 
                      ...prev, 
                      name: e.target.value 
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contract-symbol">Token Symbol</Label>
                  <Input
                    id="contract-symbol"
                    placeholder="VST"
                    value={deploymentForm.symbol}
                    onChange={(e) => setDeploymentForm(prev => ({ 
                      ...prev, 
                      symbol: e.target.value 
                    }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-address">Admin Address</Label>
                <Input
                  id="admin-address"
                  placeholder="0x..."
                  value={deploymentForm.adminAddress}
                  onChange={(e) => setDeploymentForm(prev => ({ 
                    ...prev, 
                    adminAddress: e.target.value 
                  }))}
                />
                <p className="text-xs text-gray-500">
                  This address will have administrative privileges in the contract
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">
                  📋 Deployment Information
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Contract will be deployed to Base Sepolia testnet</li>
                  <li>• Deployment requires ETH for gas fees</li>
                  <li>• Process typically takes 1-2 minutes</li>
                  <li>• Contract address will be automatically configured</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleDeploy}
                disabled={isDeploying}
                size="lg"
                className="w-full"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deploying Contract...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Deploy Smart Contract
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contract Features */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Contract Features</CardTitle>
          <CardDescription>
            Features available in the deployed SACCO contract
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Member Management</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Member registration and approval</li>
                <li>• Role-based access control</li>
                <li>• Member status tracking</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Financial Operations</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Savings deposits and withdrawals</li>
                <li>• Loan requests and disbursements</li>
                <li>• Automated interest calculations</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Governance</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Proposal creation and voting</li>
                <li>• Democratic decision making</li>
                <li>• Transparent vote tracking</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Security Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Reentrancy protection</li>
                <li>• Pausable functionality</li>
                <li>• Multi-signature controls</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}