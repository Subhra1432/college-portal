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
} from '@mui/icons-material';

// Dummy payment data
const DUMMY_PAYMENTS = [
  {
    id: 'INV-2023-001',
    type: 'Tuition Fee',
    academicYear: '2022-2023',
    semester: 'Spring',
    amount: 45000,
    dueDate: '2023-01-15',
    status: 'paid',
    paymentDate: '2023-01-10',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN12345678',
  },
  {
    id: 'INV-2023-002',
    type: 'Hostel Fee',
    academicYear: '2022-2023',
    semester: 'Spring',
    amount: 25000,
    dueDate: '2023-01-15',
    status: 'paid',
    paymentDate: '2023-01-10',
    paymentMethod: 'Net Banking',
    transactionId: 'TXN87654321',
  },
  {
    id: 'INV-2023-003',
    type: 'Library Fee',
    academicYear: '2022-2023',
    semester: 'Spring',
    amount: 5000,
    dueDate: '2023-01-31',
    status: 'paid',
    paymentDate: '2023-01-25',
    paymentMethod: 'UPI',
    transactionId: 'TXN98765432',
  },
  {
    id: 'INV-2023-004',
    type: 'Examination Fee',
    academicYear: '2022-2023',
    semester: 'Spring',
    amount: 8000,
    dueDate: '2023-03-31',
    status: 'pending',
    paymentDate: null,
    paymentMethod: null,
    transactionId: null,
  },
  {
    id: 'INV-2023-005',
    type: 'Development Fee',
    academicYear: '2022-2023',
    semester: 'Spring',
    amount: 10000,
    dueDate: '2023-04-15',
    status: 'pending',
    paymentDate: null,
    paymentMethod: null,
    transactionId: null,
  },
];

const Payments = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openPayDialog, setOpenPayDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Calculate total paid and pending amounts
  const calculateAmounts = () => {
    let paid = 0;
    let pending = 0;
    
    DUMMY_PAYMENTS.forEach(payment => {
      if (payment.status === 'paid') {
        paid += payment.amount;
      } else {
        pending += payment.amount;
      }
    });
    
    return { paid, pending };
  };
  
  const { paid, pending } = calculateAmounts();
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Handle payment click
  const handlePaymentClick = (payment) => {
    setSelectedPayment(payment);
    setOpenPayDialog(true);
    setActiveStep(0);
    setPaymentMethod('');
    setPaymentSuccess(false);
  };
  
  // Handle receipt click
  const handleReceiptClick = (payment) => {
    setSelectedPayment(payment);
    setOpenReceiptDialog(true);
  };
  
  // Handle payment dialog close
  const handlePayDialogClose = () => {
    setOpenPayDialog(false);
    setSelectedPayment(null);
  };
  
  // Handle receipt dialog close
  const handleReceiptDialogClose = () => {
    setOpenReceiptDialog(false);
    setSelectedPayment(null);
  };
  
  // Handle next step in payment process
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
    if (activeStep === 1) {
      // Simulate payment processing
      setTimeout(() => {
        setPaymentSuccess(true);
      }, 1500);
    }
  };
  
  // Handle back step in payment process
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Payment steps
  const steps = ['Select Payment Method', 'Enter Details', 'Confirmation'];
  
  // Render payment form based on active step
  const renderPaymentForm = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl component="fieldset">
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel 
                  value="creditCard" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CreditCardIcon sx={{ mr: 1 }} />
                      <Typography>Credit/Debit Card</Typography>
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="netBanking" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccountBalanceIcon sx={{ mr: 1 }} />
                      <Typography>Net Banking</Typography>
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="upi" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachMoneyIcon sx={{ mr: 1 }} />
                      <Typography>UPI Payment</Typography>
                    </Box>
                  } 
                />
              </RadioGroup>
            </FormControl>
          </Box>
        );
      
      case 1:
        if (paymentMethod === 'creditCard') {
          return (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Card Number"
                    variant="outlined"
                    fullWidth
                    placeholder="1234 5678 9012 3456"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Expiry Date"
                    variant="outlined"
                    fullWidth
                    placeholder="MM/YY"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CVV"
                    variant="outlined"
                    fullWidth
                    placeholder="123"
                    type="password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Cardholder Name"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
          );
        } else if (paymentMethod === 'netBanking') {
          return (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Select Bank</InputLabel>
                <Select
                  label="Select Bank"
                >
                  <MenuItem value="sbi">State Bank of India</MenuItem>
                  <MenuItem value="hdfc">HDFC Bank</MenuItem>
                  <MenuItem value="icici">ICICI Bank</MenuItem>
                  <MenuItem value="axis">Axis Bank</MenuItem>
                  <MenuItem value="pnb">Punjab National Bank</MenuItem>
                </Select>
              </FormControl>
              <Alert severity="info">
                You will be redirected to your bank's website to complete the payment.
              </Alert>
            </Box>
          );
        } else if (paymentMethod === 'upi') {
          return (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="UPI ID"
                variant="outlined"
                fullWidth
                placeholder="your-upi-id@bank"
                sx={{ mb: 2 }}
              />
              <Alert severity="info">
                A payment request will be sent to your UPI app.
              </Alert>
            </Box>
          );
        }
        return null;
      
      case 2:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            {paymentSuccess ? (
              <>
                <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Payment Successful!
                </Typography>
                <Typography variant="body1" paragraph>
                  Your payment of {formatCurrency(selectedPayment?.amount)} for {selectedPayment?.type} has been processed successfully.
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Transaction ID: TXN{Math.floor(Math.random() * 10000000)}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<ReceiptIcon />}
                  sx={{ mt: 2 }}
                >
                  Download Receipt
                </Button>
              </>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #f3f3f3', borderTop: '3px solid #3f51b5', animation: 'spin 1s linear infinite' }} />
                </Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Processing Payment...
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Please do not close this window.
                </Typography>
              </>
            )}
          </Box>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Fees & Payments
          </Typography>
        </Grid>
        
        {/* Payment Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AttachMoneyIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h6">
                      Total Paid
                    </Typography>
                  </Box>
                  <Typography variant="h4" color="primary">
                    {formatCurrency(paid)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PaymentIcon color="error" sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h6">
                      Pending Payments
                    </Typography>
                  </Box>
                  <Typography variant="h4" color="error">
                    {formatCurrency(pending)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ReceiptIcon color="success" sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h6">
                      Recent Payments
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {DUMMY_PAYMENTS.filter(payment => payment.status === 'paid').length} payment(s) in this semester
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Payment History */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment History
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Typography variant="subtitle2">Invoice ID</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2">Description</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2">Due Date</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2">Amount</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2">Status</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2">Actions</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {DUMMY_PAYMENTS.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{payment.type}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {payment.academicYear}, {payment.semester} Semester
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(payment.dueDate)}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status === 'paid' ? 'Paid' : 'Pending'}
                          color={payment.status === 'paid' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {payment.status === 'paid' ? (
                          <Button
                            startIcon={<ReceiptIcon />}
                            size="small"
                            onClick={() => handleReceiptClick(payment)}
                          >
                            Receipt
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PaymentIcon />}
                            size="small"
                            onClick={() => handlePaymentClick(payment)}
                          >
                            Pay Now
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Payment Dialog */}
      <Dialog
        open={openPayDialog}
        onClose={handlePayDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Make Payment
          <IconButton
            aria-label="close"
            onClick={handlePayDialogClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedPayment && (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Fee Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedPayment.type}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Academic Year
                  </Typography>
                  <Typography variant="body1">
                    {selectedPayment.academicYear}, {selectedPayment.semester}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Due Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedPayment.dueDate)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Amount
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(selectedPayment.amount)}
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              {renderPaymentForm()}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: activeStep === 2 && paymentSuccess ? 'center' : 'space-between' }}>
          {activeStep === 2 && paymentSuccess ? (
            <Button onClick={handlePayDialogClose} variant="contained" color="primary">
              Done
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleBack} 
                disabled={activeStep === 0}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                onClick={handleNext}
                disabled={activeStep === 0 && !paymentMethod}
              >
                {activeStep === steps.length - 1 ? 'Pay' : 'Next'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Receipt Dialog */}
      <Dialog
        open={openReceiptDialog}
        onClose={handleReceiptDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Payment Receipt
          <IconButton
            aria-label="close"
            onClick={handleReceiptDialogClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedPayment && (
            <Box sx={{ p: 2 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  College Portal
                </Typography>
                <Typography variant="subtitle1">
                  Payment Receipt
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Receipt No.
                  </Typography>
                  <Typography variant="body1">
                    {selectedPayment.id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedPayment.paymentDate)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Student Name
                  </Typography>
                  <Typography variant="body1">
                    {user?.name || 'John Doe'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Registration No.
                  </Typography>
                  <Typography variant="body1">
                    {user?.regNumber || 'REG12345'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Payment For
                  </Typography>
                  <Typography variant="body1">
                    {selectedPayment.type}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Academic Year
                  </Typography>
                  <Typography variant="body1">
                    {selectedPayment.academicYear}, {selectedPayment.semester}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Payment Method
                  </Typography>
                  <Typography variant="body1">
                    {selectedPayment.paymentMethod}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body1">
                    {selectedPayment.transactionId}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Amount Paid
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {formatCurrency(selectedPayment.amount)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  This is an electronically generated receipt and does not require a signature.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            startIcon={<DownloadIcon />}
            onClick={handleReceiptDialogClose}
          >
            Download
          </Button>
          <Button 
            variant="contained" 
            onClick={handleReceiptDialogClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Payments; 