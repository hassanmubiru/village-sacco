'use client';

import { memo } from 'react';
import { 
  PiggyBank, 
  CreditCard, 
  Users, 
  Vote, 
  TrendingUp, 
  Shield,
  Wallet,
  AlertCircle
} from 'lucide-react';

// Define and memoize all icons used in the app
const Icons = {
  PiggyBank: memo(PiggyBank),
  CreditCard: memo(CreditCard),
  Users: memo(Users),
  Vote: memo(Vote),
  TrendingUp: memo(TrendingUp),
  Shield: memo(Shield),
  Wallet: memo(Wallet),
  AlertCircle: memo(AlertCircle),
};

export default Icons;
