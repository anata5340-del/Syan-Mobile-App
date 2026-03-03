import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import MainHeader from '../layout/MainHeader';
import { COLORS, FONTS } from '../Constants/theme';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { GlobalStyleSheet } from '../Constants/StyleSheet';
import { useAuthStore } from '../stores/auth.store';
import { useUserSubscriptions } from '../hooks/react-query/useSubscriptions';

const STATUS_COLOR = {
  paid: '#4CAF50',
  due: '#EF6A77',
};

interface Course {
  type: 'quiz' | 'video';
  _id: string;
}

interface PackageInfo {
  _id: string;
  name: string;
  price?: number;
  active: boolean;
  courses: Course[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  displayId: string;
}

interface UserPackage {
  startDate: string;
  endDate: string;
  active: boolean;
  price: number;
  _id: string;
  packageInfo: PackageInfo;
}

const Invoices: React.FC = () => {
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const userId = user?._id || '';

  const { data: packagesData, isLoading: packagesLoading, isError } = useUserSubscriptions(userId);

  // Debug logging
  useEffect(() => {
    console.log('Invoices Screen - User ID:', userId);
    console.log('Invoices Screen - Loading:', packagesLoading);
    console.log('Invoices Screen - Error:', isError);
    console.log('Invoices Screen - Data:', packagesData);
  }, [userId, packagesLoading, isError, packagesData]);

  // Function to count courses
  const getCourseCounts = (courses: Course[]) => {
    if (!courses || courses.length === 0) {
      return {
        quizCount: 0,
        videoCount: 0,
        totalCount: 0,
        display: '0 courses'
      };
    }
    
    const quizCount = courses.filter(c => c.type === 'quiz').length;
    const videoCount = courses.filter(c => c.type === 'video').length;
    return { 
      quizCount, 
      videoCount, 
      totalCount: courses.length,
      display: `${courses.length} (${quizCount}Q, ${videoCount}V)`
    };
  };

  // Function to generate HTML for PDF
  // const generateInvoiceHTML = (invoice: UserPackage) => {
  //   const courseCounts = getCourseCounts(invoice.packageInfo?.courses || []);
  //   const status = invoice.active ? 'PAID' : 'DUE';
  //   const currentDate = new Date().toLocaleDateString();
    
  //   return `
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <meta charset="UTF-8">
  //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //         <style>
  //           * {
  //             margin: 0;
  //             padding: 0;
  //             box-sizing: border-box;
  //           }
  //           body {
  //             font-family: 'Helvetica', 'Arial', sans-serif;
  //             padding: 40px;
  //             color: #333;
  //             background-color: #ffffff;
  //           }
  //           .container {
  //             max-width: 800px;
  //             margin: 0 auto;
  //           }
  //           .header {
  //             text-align: center;
  //             margin-bottom: 40px;
  //             border-bottom: 4px solid #EF6A77;
  //             padding-bottom: 25px;
  //           }
  //           .header h1 {
  //             color: #EF6A77;
  //             margin: 0 0 10px 0;
  //             font-size: 36px;
  //             font-weight: bold;
  //             letter-spacing: 2px;
  //           }
  //           .header p {
  //             color: #666;
  //             margin: 5px 0;
  //             font-size: 16px;
  //           }
  //           .invoice-meta {
  //             display: flex;
  //             justify-content: space-between;
  //             margin-bottom: 30px;
  //             padding: 15px;
  //             background-color: #f8f9fa;
  //             border-radius: 8px;
  //           }
  //           .invoice-meta div {
  //             flex: 1;
  //           }
  //           .invoice-meta strong {
  //             display: block;
  //             color: #EF6A77;
  //             margin-bottom: 5px;
  //             font-size: 12px;
  //             text-transform: uppercase;
  //           }
  //           .invoice-meta span {
  //             font-size: 14px;
  //             color: #333;
  //           }
  //           .invoice-details {
  //             margin: 30px 0;
  //             border: 1px solid #e0e0e0;
  //             border-radius: 8px;
  //             overflow: hidden;
  //           }
  //           .row {
  //             display: flex;
  //             justify-content: space-between;
  //             padding: 15px 20px;
  //             border-bottom: 1px solid #f0f0f0;
  //           }
  //           .row:last-child {
  //             border-bottom: none;
  //           }
  //           .row:nth-child(even) {
  //             background-color: #f8f9fa;
  //           }
  //           .row strong {
  //             color: #333;
  //             font-weight: 600;
  //             font-size: 14px;
  //           }
  //           .row span {
  //             color: #666;
  //             font-size: 14px;
  //           }
  //           .status-badge {
  //             display: inline-block;
  //             padding: 6px 20px;
  //             border-radius: 20px;
  //             color: white;
  //             font-weight: bold;
  //             font-size: 12px;
  //             background-color: ${status === 'PAID' ? '#4CAF50' : '#EF6A77'};
  //           }
  //           .total-section {
  //             margin-top: 40px;
  //             padding: 25px;
  //             background: linear-gradient(135deg, #EF6A77 0%, #d45868 100%);
  //             border-radius: 8px;
  //             text-align: right;
  //           }
  //           .total-section p {
  //             color: rgba(255, 255, 255, 0.9);
  //             font-size: 14px;
  //             margin-bottom: 8px;
  //           }
  //           .total-section h2 {
  //             margin: 0;
  //             color: white;
  //             font-size: 36px;
  //             font-weight: bold;
  //           }
  //           .footer {
  //             margin-top: 60px;
  //             padding-top: 20px;
  //             border-top: 2px solid #e0e0e0;
  //             text-align: center;
  //           }
  //           .footer p {
  //             color: #999;
  //             font-size: 13px;
  //             line-height: 1.6;
  //             margin: 5px 0;
  //           }
  //           .footer .contact {
  //             color: #EF6A77;
  //             font-weight: 600;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="container">
  //           <div class="header">
  //             <h1>SYAN ACADEMY</h1>
  //             <p>Professional Invoice Receipt</p>
  //             <p style="font-size: 12px; color: #999;">Generated on ${currentDate}</p>
  //           </div>
            
  //           <div class="invoice-meta">
  //             <div>
  //               <strong>Invoice To</strong>
  //               <span>${user?.firstName || 'Customer'}</span>
  //             </div>
  //             <div>
  //               <strong>Order ID</strong>
  //               <span>${invoice.packageInfo?.displayId || 'N/A'}</span>
  //             </div>
  //             <div>
  //               <strong>Package</strong>
  //               <span>${invoice.packageInfo?.name || 'N/A'}</span>
  //             </div>
  //           </div>
            
  //           <div class="invoice-details">
  //             <div class="row">
  //               <strong>Start Date</strong>
  //               <span>${invoice.startDate}</span>
  //             </div>
  //             <div class="row">
  //               <strong>End Date</strong>
  //               <span>${invoice.endDate}</span>
  //             </div>
  //             <div class="row">
  //               <strong>Total Courses</strong>
  //               <span>${courseCounts.display}</span>
  //             </div>
  //             <div class="row">
  //               <strong>Quiz Courses</strong>
  //               <span>${courseCounts.quizCount} Quizzes</span>
  //             </div>
  //             <div class="row">
  //               <strong>Video Courses</strong>
  //               <span>${courseCounts.videoCount} Videos</span>
  //             </div>
  //             <div class="row">
  //               <strong>Payment Status</strong>
  //               <span class="status-badge">${status}</span>
  //             </div>
  //           </div>
            
  //           <div class="total-section">
  //             <p>Total Amount</p>
  //             <h2>PKR ${invoice.price}</h2>
  //           </div>
            
  //           <div class="footer">
  //             <p>Thank you for choosing SYAN Academy!</p>
  //             <p>For any queries or support, please contact us at:</p>
  //             <p class="contact">support@syanacademy.com</p>
  //             <p style="margin-top: 20px; font-size: 11px;">
  //               This is a computer-generated invoice and does not require a signature.
  //             </p>
  //           </div>
  //         </div>
  //       </body>
  //     </html>
  //   `;
  // };

  // Function to download/share invoice
  // const handleDownloadInvoice = async (invoice: UserPackage) => {
  //   try {
  //     const html = generateInvoiceHTML(invoice);
      
  //     // Generate PDF options
  //     const options = {
  //       html: html,
  //       fileName: `Invoice_${invoice.packageInfo?.displayId || 'unknown'}`,
  //       directory: 'Documents',
  //       base64: false,
  //     };

  //     console.log('Generating PDF with options:', options);
      
  //     // Generate PDF
  //     const results = await generatePDF(options);
      
  //     console.log('PDF generated:', results);

  //     if (results.filePath) {
  //       // Use react-native-share to show native share dialog
  //       const shareOptions = {
  //         title: 'Invoice',
  //         subject: `Invoice ${invoice.packageInfo?.displayId}`,
  //         message: `Invoice for ${invoice.packageInfo?.name}`,
  //         url: Platform.OS === 'android' 
  //           ? `file://${results.filePath}` 
  //           : results.filePath,
  //         type: 'application/pdf',
  //         failOnCancel: false, // Don't throw error if user cancels
  //       };

  //       console.log('Opening share dialog with options:', shareOptions);
        
  //       await Share.open(shareOptions);
        
  //       console.log('Share dialog opened successfully');
  //     } else {
  //       throw new Error('PDF generation failed - no file path returned');
  //     }
  //   } catch (error: any) {
  //     console.error('Error generating/sharing invoice:', error);
      
  //     // Don't show error if user just cancelled the share dialog
  //     if (error && error.message && error.message.includes('User did not share')) {
  //       console.log('User cancelled share dialog');
  //       return;
  //     }
      
  //     Alert.alert(
  //       'Error',
  //       error?.message || 'Failed to generate invoice. Please try again.',
  //       [{ text: 'OK' }]
  //     );
  //   }
  // };

  // Check if user is not logged in
  if (!userId) {
    return (
      <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
        <MainHeader screenName="Invoices" drawarNavigation />
        <View style={styles.emptyState}>
          <FeatherIcon name="user-x" size={60} color="#CCC" />
          <Text style={styles.emptyText}>Please login to view invoices</Text>
        </View>
      </View>
    );
  }

  const invoices: UserPackage[] = packagesData?.data?.pkgs || [];

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader screenName="Invoices" drawarNavigation />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Heading Card */}
        <View
          style={[
            GlobalStyleSheet.container,
            {
              backgroundColor: '#FFFEFE',
              paddingVertical: 15,
              borderRadius: 15,
              marginTop: 10,
            },
          ]}
        >
          <Text
            style={[
              FONTS.fontRegular,
              {
                fontSize: 15,
                color: COLORS.title,
                textAlign: 'center',
              },
            ]}
          >
            View and download your invoices
          </Text>
        </View>

        {/* NO INVOICES STATE */}
        {!packagesLoading && !isError && (!invoices || invoices.length === 0) && (
  <View style={styles.emptyState}>
    <FeatherIcon name="file-text" size={60} color="#CCC" />
    <Text style={styles.emptyText}>No invoices found</Text>
    <Text style={styles.emptySubtext}>
      Your invoices will appear here once you subscribe to a package
    </Text>
  </View>
)}

        {/* RENDER INVOICES */}
        {invoices.map((item: UserPackage) => {
          const status = item.active ? 'paid' : 'due';

          return (
            <View key={item._id} style={styles.invoiceCard}>
              {/* Download Button */}
              {/* <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => handleDownloadInvoice(item)}
              >
                <FeatherIcon color={COLORS.white} name="download" size={20} />
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity> */}

              {/* ORDER ID */}
              <InvoiceRow
                title="ORDER ID"
                value={item.packageInfo?.displayId || '--'}
              />

              {/* DATE */}
              <InvoiceRow title="DATE" value={item.startDate || '--'} />

              {/* COURSES */}
              <InvoiceRow
                title="COURSES"
                value={item.packageInfo?.name || '--'}
              />

              {/* Amount */}
              <InvoiceRow title="AMOUNT" value={`PKR ${item.price || 0}`} />

              {/* STATUS */}
              <View style={styles.row}>
                <Text
                  style={[
                    FONTS.fontRegular,
                    { fontSize: 13, color: COLORS.title },
                  ]}
                >
                  STATUS
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.white,
                    backgroundColor: STATUS_COLOR[status],
                    paddingHorizontal: 25,
                    paddingVertical: 4,
                    borderRadius: 50,
                    fontWeight: '600',
                  }}
                >
                  {status.toUpperCase()}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

// Reusable Row Component
const InvoiceRow = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <View style={styles.row}>
    <Text style={[FONTS.fontRegular, { fontSize: 13, color: COLORS.title }]}>
      {title}
    </Text>
    <Text style={[FONTS.fontLight, { fontSize: 12, color: COLORS.title }]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  invoiceCard: {
    backgroundColor: '#EDF7FF',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginHorizontal: '5%',
    marginVertical: '3%',
    borderWidth: 1,
    borderColor: '#ACCEE9',
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '4%',
    paddingHorizontal: '3%',
  },
  downloadButton: {
    backgroundColor: '#EF6A77',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 15,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  downloadText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    ...FONTS.fontRegular,
    fontSize: 16,
    color: COLORS.title,
    marginTop: 15,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  errorText: {
    ...FONTS.fontSemiBold,
    fontSize: 18,
    color: '#EF6A77',
    marginTop: 15,
  },
  errorSubtext: {
    ...FONTS.fontRegular,
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF6A77',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    ...FONTS.fontRegular,
    fontSize: 16,
    color: '#999',
    marginTop: 15,
  },
  emptySubtext: {
    ...FONTS.fontRegular,
    fontSize: 14,
    color: '#BBB',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default Invoices;