import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Tabs,
  Tab,
  InputAdornment,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  DownloadForOffline as DownloadIcon,
  LocalAtm as LocalAtmIcon,
  History as HistoryIcon,
  Print as PrintIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

// Mock payment data
const MOCK_PAYMENT_DATA = {
  student: {
    id: 'STU123456',
    name: 'John Smith',
    program: 'B.Tech',
    batch: '2022-2026',
    semester: 'Semester 3',
  },
  fees: {
    tuitionFee: 45000,
    developmentFee: 15000,
    libraryFee: 5000,
    examFee: 2500,
    miscFee: 2500,
    totalDue: 70000,
    paid: 35000,
    balance: 35000,
    dueDate: '2023-11-15',
  },
  paymentHistory: [
    {
      id: 'PAY10001',
      date: '2023-07-25',
      amount: 35000,
      mode: 'Online Banking',
      reference: 'REF78923451',
      status: 'Success',
      description: 'First installment payment for Semester 3',
      receiptUrl: '#',
    },
    {
      id: 'PAY10000',
      date: '2023-02-15',
      amount: 70000,
      mode: 'Credit Card',
      reference: 'REF45678901',
      status: 'Success',
      description: 'Full payment for Semester 2',
      receiptUrl: '#',
    },
    {
      id: 'PAY9999',
      date: '2022-08-10',
      amount: 70000,
      mode: 'Bank Transfer',
      reference: 'REF12345678',
      status: 'Success',
      description: 'Full payment for Semester 1',
      receiptUrl: '#',
    },
  ],
  upcomingPayments: [
    {
      id: 'UP1001',
      dueDate: '2023-11-15',
      amount: 35000,
      description: 'Second installment payment for Semester 3',
      status: 'Pending',
    },
    {
      id: 'UP1002',
      dueDate: '2024-01-15',
      amount: 70000,
      description: 'Full payment for Semester 4',
      status: 'Not due',
    },
  ],
};

const Payments = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [paymentAmount, setPaymentAmount] = useState(MOCK_PAYMENT_DATA.fees.balance);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handlePayNowClick = () => {
    setPaymentDialogOpen(true);
  };
  
  const handlePaymentDialogClose = () => {
    if (!paymentProcessing) {
      setPaymentDialogOpen(false);
      setActiveStep(0);
      setPaymentMethod('creditCard');
      setPaymentSuccess(false);
    }
  };
  
  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBackStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
  
  const handleCardDetailsChange = (event) => {
    const { name, value } = event.target;
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };
  
  const handlePaymentSubmit = () => {
    setPaymentProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      setActiveStep(3);
    }, 2000);
  };
  
  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setReceiptDialogOpen(true);
  };
  
  const handleCloseReceiptDialog = () => {
    setReceiptDialogOpen(false);
  };
  
  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };
  
  // Filter payment history based on search term and status filter
  const filteredPaymentHistory = MOCK_PAYMENT_DATA.paymentHistory.filter(payment => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || payment.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  // Payment steps
  const steps = ['Select amount', 'Choose payment method', 'Make payment', 'Confirmation'];
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PaymentIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              Payments
            </Typography>
          </Box>
        </Grid>
        
        {/* Fee Summary */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Fee Summary: {MOCK_PAYMENT_DATA.student.semester}
              </Typography>
              <Typography variant="body1" paragraph>
                Due Date: {formatDate(MOCK_PAYMENT_DATA.fees.dueDate)} ({getDaysUntilDue(MOCK_PAYMENT_DATA.fees.dueDate)} days remaining)
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="overline" sx={{ opacity: 0.8 }}>
                    Total Fee
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(MOCK_PAYMENT_DATA.fees.totalDue)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="overline" sx={{ opacity: 0.8 }}>
                    Paid Amount
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(MOCK_PAYMENT_DATA.fees.paid)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="overline" sx={{ opacity: 0.8 }}>
                    Balance Due
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(MOCK_PAYMENT_DATA.fees.balance)}
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  startIcon={<AttachMoneyIcon />}
                  onClick={handlePayNowClick}
                  disabled={MOCK_PAYMENT_DATA.fees.balance === 0}
                  sx={{ mr: 2 }}
                >
                  Pay Now
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  startIcon={<ReceiptIcon />}
                  sx={{ borderColor: 'rgba(255, 255, 255, 0.5)', '&:hover': { borderColor: 'white' } }}
                >
                  Download Statement
                </Button>
              </Box>
            </Box>
            
            <Box 
              sx={{ 
                position: 'absolute',
                top: -15,
                right: -15,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: 200,
                height: 200,
              }} 
            />
            <Box 
              sx={{ 
                position: 'absolute',
                bottom: -30,
                left: -30,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: 150,
                height: 150,
              }} 
            />
          </Paper>
        </Grid>
        
        {/* Payment Method Card */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Payment Methods
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CreditCardIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Credit/Debit Card" 
                    secondary="Pay using VISA, Mastercard, RuPay"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccountBalanceIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="NetBanking" 
                    secondary="Pay through your bank account"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocalAtmIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="UPI Payment" 
                    secondary="Google Pay, PhonePe, Paytm"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Fee Breakdown */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Fee Breakdown
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fee Component</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Tuition Fee</TableCell>
                    <TableCell align="right">{formatCurrency(MOCK_PAYMENT_DATA.fees.tuitionFee)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Development Fee</TableCell>
                    <TableCell align="right">{formatCurrency(MOCK_PAYMENT_DATA.fees.developmentFee)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Library Fee</TableCell>
                    <TableCell align="right">{formatCurrency(MOCK_PAYMENT_DATA.fees.libraryFee)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Examination Fee</TableCell>
                    <TableCell align="right">{formatCurrency(MOCK_PAYMENT_DATA.fees.examFee)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Miscellaneous Fee</TableCell>
                    <TableCell align="right">{formatCurrency(MOCK_PAYMENT_DATA.fees.miscFee)}</TableCell>
                  </TableRow>
                  <TableRow sx={{ '& td': { fontWeight: 'bold' } }}>
                    <TableCell>Total</TableCell>
                    <TableCell align="right">{formatCurrency(MOCK_PAYMENT_DATA.fees.totalDue)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Tabs for Payment History and Upcoming Payments */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Payment History" icon={<HistoryIcon />} iconPosition="start" />
              <Tab label="Upcoming Payments" icon={<LocalAtmIcon />} iconPosition="start" />
            </Tabs>
            
            {activeTab === 0 && (
              <>
                <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
                  <TextField
                    placeholder="Search payments..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="success">Success</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="failed">Failed</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <IconButton color="primary" title="Print History">
                    <PrintIcon />
                  </IconButton>
                  <IconButton color="primary" title="Download History">
                    <DownloadIcon />
                  </IconButton>
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Payment ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Mode</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPaymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.id}</TableCell>
                          <TableCell>{formatDate(payment.date)}</TableCell>
                          <TableCell>{payment.description}</TableCell>
                          <TableCell>{payment.mode}</TableCell>
                          <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>
                            <Chip
                              label={payment.status}
                              color={payment.status === 'Success' ? 'success' : payment.status === 'Pending' ? 'warning' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              startIcon={<ReceiptIcon />}
                              onClick={() => handleViewReceipt(payment)}
                            >
                              Receipt
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {filteredPaymentHistory.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      No payment records found matching your criteria
                    </Typography>
                  </Box>
                )}
              </>
            )}
            
            {activeTab === 1 && (
              <>
                <Typography variant="subtitle1" paragraph>
                  Your upcoming payment schedule is shown below. Please ensure timely payments to avoid late fees.
                </Typography>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {MOCK_PAYMENT_DATA.upcomingPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{formatDate(payment.dueDate)}</TableCell>
                          <TableCell>{payment.description}</TableCell>
                          <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>
                            <Chip
                              label={payment.status}
                              color={payment.status === 'Pending' ? 'warning' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={handlePayNowClick}
                              disabled={payment.status === 'Not due'}
                            >
                              Pay Now
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Payment Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={handlePaymentDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Make a Payment
        </DialogTitle>
        <DialogContent dividers>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {activeStep === 0 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Payment Amount
              </Typography>
              <Typography variant="body2" paragraph color="text.secondary">
                Enter the amount you wish to pay. The current balance due is {formatCurrency(MOCK_PAYMENT_DATA.fees.balance)}.
              </Typography>
              
              <TextField
                label="Amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                fullWidth
                margin="normal"
                variant="outlined"
                helperText={`Maximum amount: ${formatCurrency(MOCK_PAYMENT_DATA.fees.balance)}`}
              />
              
              {paymentAmount > MOCK_PAYMENT_DATA.fees.balance && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Amount cannot exceed balance due
                </Alert>
              )}
              
              {paymentAmount <= 0 && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Amount must be greater than zero
                </Alert>
              )}
            </Box>
          )}
          
          {activeStep === 1 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Select Payment Method
              </Typography>
              
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <RadioGroup
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                >
                  <FormControlLabel 
                    value="creditCard" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CreditCardIcon sx={{ mr: 1 }} />
                        <span>Credit/Debit Card</span>
                      </Box>
                    }
                  />
                  <FormControlLabel 
                    value="netBanking" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccountBalanceIcon sx={{ mr: 1 }} />
                        <span>Net Banking</span>
                      </Box>
                    }
                  />
                  <FormControlLabel 
                    value="upi" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalAtmIcon sx={{ mr: 1 }} />
                        <span>UPI Payment</span>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          )}
          
          {activeStep === 2 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {paymentMethod === 'creditCard' && 'Credit/Debit Card Details'}
                {paymentMethod === 'netBanking' && 'Net Banking Details'}
                {paymentMethod === 'upi' && 'UPI Payment Details'}
              </Typography>
              
              {paymentMethod === 'creditCard' && (
                <>
                  <TextField
                    label="Card Number"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardDetailsChange}
                    fullWidth
                    margin="normal"
                    placeholder="1234 5678 9012 3456"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CreditCardIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Name on Card"
                    name="nameOnCard"
                    value={cardDetails.nameOnCard}
                    onChange={handleCardDetailsChange}
                    fullWidth
                    margin="normal"
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Expiry Date (MM/YY)"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleCardDetailsChange}
                        fullWidth
                        margin="normal"
                        placeholder="MM/YY"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="CVV"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardDetailsChange}
                        fullWidth
                        margin="normal"
                        type="password"
                      />
                    </Grid>
                  </Grid>
                </>
              )}
              
              {paymentMethod === 'netBanking' && (
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Select Bank</InputLabel>
                    <Select
                      value=""
                      label="Select Bank"
                    >
                      <MenuItem value="sbi">State Bank of India</MenuItem>
                      <MenuItem value="hdfc">HDFC Bank</MenuItem>
                      <MenuItem value="icici">ICICI Bank</MenuItem>
                      <MenuItem value="axis">Axis Bank</MenuItem>
                      <MenuItem value="pnb">Punjab National Bank</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    You will be redirected to your bank's website to complete the payment.
                  </Typography>
                </Box>
              )}
              
              {paymentMethod === 'upi' && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="UPI ID"
                    fullWidth
                    margin="normal"
                    placeholder="example@upi"
                    helperText="Enter your UPI ID (e.g., mobilenumber@upi, username@bankname)"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    You will receive a payment request on your UPI app to complete the transaction.
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Payment Summary
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Amount:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      {formatCurrency(paymentAmount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Method:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      {paymentMethod === 'creditCard' && 'Credit/Debit Card'}
                      {paymentMethod === 'netBanking' && 'Net Banking'}
                      {paymentMethod === 'upi' && 'UPI Payment'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">
                      Total:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" align="right">
                      {formatCurrency(paymentAmount)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
          
          {activeStep === 3 && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              {paymentProcessing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CircularProgress sx={{ mb: 2 }} />
                  <Typography variant="h6">
                    Processing Payment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please wait while we process your payment...
                  </Typography>
                </Box>
              ) : paymentSuccess ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Payment Successful!
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Your payment of {formatCurrency(paymentAmount)} has been processed successfully.
                  </Typography>
                  <Typography variant="body2" paragraph color="text.secondary">
                    Transaction ID: TXN{Math.floor(Math.random() * 10000000)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A receipt has been sent to your registered email address.
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<ReceiptIcon />}
                      sx={{ mr: 2 }}
                    >
                      View Receipt
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<DownloadIcon />}
                    >
                      Download Receipt
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" color="error">
                    Payment Failed
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    There was an error processing your payment. Please try again.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {activeStep === steps.length - 1 ? (
            <Button onClick={handlePaymentDialogClose} disabled={paymentProcessing}>
              Close
            </Button>
          ) : (
            <>
              <Button 
                onClick={handlePaymentDialogClose} 
                disabled={paymentProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleBackStep} 
                disabled={activeStep === 0 || paymentProcessing}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={activeStep === 2 ? handlePaymentSubmit : handleNextStep}
                disabled={(activeStep === 0 && (paymentAmount <= 0 || paymentAmount > MOCK_PAYMENT_DATA.fees.balance)) || paymentProcessing}
              >
                {activeStep === 2 ? 'Make Payment' : 'Next'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Receipt Dialog */}
      <Dialog
        open={receiptDialogOpen}
        onClose={handleCloseReceiptDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedReceipt && (
          <>
            <DialogTitle>
              Payment Receipt
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ p: 2, border: '1px dashed #ccc' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      College Portal
                    </Typography>
                    <Typography variant="body2">
                      123 Education Street
                    </Typography>
                    <Typography variant="body2">
                      Knowledge City, ED 12345
                    </Typography>
                    <Typography variant="body2">
                      Phone: (123) 456-7890
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" gutterBottom>
                      Receipt
                    </Typography>
                    <Typography variant="body2">
                      Receipt No: {selectedReceipt.id}
                    </Typography>
                    <Typography variant="body2">
                      Date: {formatDate(selectedReceipt.date)}
                    </Typography>
                    <Typography variant="body2">
                      Reference: {selectedReceipt.reference}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Student Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>ID:</strong> {MOCK_PAYMENT_DATA.student.id}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Name:</strong> {MOCK_PAYMENT_DATA.student.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Program:</strong> {MOCK_PAYMENT_DATA.student.program}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Batch:</strong> {MOCK_PAYMENT_DATA.student.batch}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Payment Details
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Description</TableCell>
                          <TableCell align="right">Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{selectedReceipt.description}</TableCell>
                          <TableCell align="right">{formatCurrency(selectedReceipt.amount)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Total</strong></TableCell>
                          <TableCell align="right"><strong>{formatCurrency(selectedReceipt.amount)}</strong></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Payment Method
                  </Typography>
                  <Typography variant="body2">
                    {selectedReceipt.mode}
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" gutterBottom>
                    This is a computer-generated receipt and does not require a signature.
                  </Typography>
                  <Typography variant="body2">
                    For any queries, please contact the accounts department.
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseReceiptDialog}>
                Close
              </Button>
              <Button 
                variant="contained" 
                startIcon={<PrintIcon />}
              >
                Print
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<DownloadIcon />}
              >
                Download
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Payments; 