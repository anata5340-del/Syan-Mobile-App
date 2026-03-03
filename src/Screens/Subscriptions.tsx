
import { View, Text,  ScrollView, Image, TouchableOpacity, StyleSheet, Platform , ActivityIndicator, } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { GlobalStyleSheet } from '../Constants/StyleSheet';
import Button from '../Components/Button';
import { COLORS, FONTS , SIZES } from '../Constants/theme';
import MainHeader from '../layout/MainHeader';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '../stores/auth.store';
import { useUserSubscriptions } from '../hooks/react-query/useSubscriptions';

// TypeScript Interfaces
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

interface InfoRowProps {
  label: string;
  value: string | number;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <FeatherIcon
      style={styles.infoIcon}
      color={COLORS.title}
      name="check-circle"
      size={18}
    />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const Subscriptions = () => {
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const userId = user?._id || '';

  const { data: packagesData, isLoading: packagesLoading } = useUserSubscriptions(userId);

  if (!user) return null;

  const packages: UserPackage[] = packagesData?.data?.pkgs || [];
  const loading = packagesLoading;

  // Count courses by type
  const getCourseCounts = (courses: Course[]) => {
    const quizCount = courses.filter(c => c.type === 'quiz').length;
    const videoCount = courses.filter(c => c.type === 'video').length;
    return { quizCount, videoCount, totalCount: courses.length };
  };

  return (
    <View style={{backgroundColor:COLORS.mainBackground,flex:1}}>
      <MainHeader screenName='My Subscriptions' drawarNavigation />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[GlobalStyleSheet.container,{backgroundColor:'#FFFEFE',paddingVertical:1,borderRadius:15,}]}>
          <View style={{flexShrink:1,alignItems:'center',marginHorizontal:'10%',marginBottom:'4%'}}>
            <Text style={[FONTS.fontRegular,{fontSize:15,color:COLORS.title,textAlign:"center"}]}>
              Here is list of package/product that you have subscribed.
            </Text>
          </View>

          {/* LOADING STATE */}
          {loading && (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading your subscriptions...</Text>
            </View>
          )}

          {/* NO PACKAGES STATE */}
          {!loading && packages.length === 0 && (
            <View style={styles.emptyState}>
              <FeatherIcon name="package" size={60} color="#CCC" />
              <Text style={styles.emptyText}>No active subscriptions found</Text>
            </View>
          )}

          <TouchableOpacity style={{
            justifyContent: 'center',
            alignItems:'center',
            marginVertical:'5%',
            borderWidth:1,
            borderColor:'#EF6A77',
            marginHorizontal:"8%",
            padding:10,
            borderRadius:50
          }}>
            <Text style={[FONTS.fontSemiBold,{fontSize:12,color:'#EF6A77',}]}>
              Upgrade Now - Go pro PKR 5000
            </Text>
          </TouchableOpacity>

          {/* PACKAGES */}
          {packages.map((pkg, index) => {
            const courseCounts = getCourseCounts(pkg.packageInfo.courses);
            
            return (
              <View
                key={`${pkg._id}-${index}`}
                style={[
                  styles.packageCard,
                  {
                    backgroundColor: pkg.active ? '#FFF0F2' : '#F8EBFF',
                    borderColor: pkg.active ? COLORS.primary : COLORS.secondary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.status,
                    { color: pkg.active ? '#01B067' : '#EF6A77' },
                  ]}
                >
                  {pkg.active ? 'Active' : 'Expired'}
                </Text>

                <View style={styles.centerBox}>
                  <Text style={styles.packageName}>{pkg.packageInfo.name}</Text>
                  <Text style={styles.packagePrice}>PKR {pkg.price}</Text>
                  <Text style={styles.packageId}>ID: {pkg.packageInfo.displayId}</Text>
                </View>

                <View style={{ marginBottom: 25 }}>
                  <InfoRow label="Started On" value={pkg.startDate} />
                  <InfoRow label="Ends On" value={pkg.endDate} />
                  <InfoRow label="Total Courses" value={courseCounts.totalCount} />
                  <InfoRow label="Quizzes" value={courseCounts.quizCount} />
                  <InfoRow label="Videos" value={courseCounts.videoCount} />
                </View>

                <Button
                  title={pkg.active ? 'View Details' : 'Renew Plan'}
                  text={COLORS.white}
                  color={pkg.active ? COLORS.primary : COLORS.secondary}
                  onPress={() => {
                    // Navigate to package details or renewal
                    console.log('Package action:', pkg.packageInfo.displayId);
                  }}
                />
              </View>
            );
          })}

          <View style={{flexShrink:1,alignItems:'center',marginHorizontal:'10%',marginBottom:'4%'}}>
            <Text style={[FONTS.fontSemiBold,{fontSize:22,color:'#EF6A77',textAlign:"center",marginBottom:10}]}>
              Payment Methods
            </Text>
            <Text style={[FONTS.fontRegular,{fontSize:13,color:COLORS.title,textAlign:"center"}]}>
              Primary payment method is used by default.
            </Text>
          </View>

          <TouchableOpacity style={{
            justifyContent: 'center',
            alignItems:'center',
            marginVertical:'5%',
            borderWidth:1,
            borderColor:'#EF6A77',
            marginHorizontal:"8%",
            padding:10,
            borderRadius:50
          }}>
            <Text style={[FONTS.fontSemiBold,{fontSize:12,color:'#EF6A77',}]}>
              Add Payment Method
            </Text>
          </TouchableOpacity>

          {/* Visa Ending */}
          <View style={{
            backgroundColor:"#FFF0F2",
            borderWidth:1,
            borderColor:"#FC959F",
            padding:'5%',
            marginBottom:"5%",
            justifyContent:'center'
          }}>
            <Text style={{...FONTS.fontSemiBold,color:COLORS.title,fontSize:18,marginBottom:10}}>
              Visa ending in 1234
            </Text>
            <View style={{flexDirection:'row',justifyContent: 'space-between',}}>
              <Text style={{...FONTS.fontLight,color:COLORS.title}}>Feature Coming Soon</Text>
              <View style={{flexDirection:'row',marginHorizontal:'2%',}}>
                <TouchableOpacity>
                  <FeatherIcon 
                    style={{backgroundColor:"#FC959F",borderRadius:12,marginHorizontal:2,padding:3}}
                    color={'white'}
                    name="trash-2"
                    size={18}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <FeatherIcon 
                    style={{backgroundColor:"#FC959F",borderRadius:12,marginHorizontal:2,padding:3}}
                    color={'white'}
                    name="edit-3"
                    size={18}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{
            backgroundColor:"#FFF0F2",
            borderWidth:1,
            borderColor:"#FC959F",
            padding:'5%',
            marginBottom:"5%",
            justifyContent:'center'
          }}>
            <Text style={{...FONTS.fontSemiBold,color:COLORS.title,fontSize:18,marginBottom:10}}>
              Mastercard ending in 1234
            </Text>
            <View style={{flexDirection:'row',justifyContent: 'space-between',}}>
              <Text style={{...FONTS.fontLight,color:COLORS.title}}>Feature Coming Soon</Text>
              <View style={{flexDirection:'row',marginHorizontal:'2%',}}>
                <TouchableOpacity>
                  <FeatherIcon 
                    style={{backgroundColor:"#FC959F",borderRadius:12,marginHorizontal:2,padding:3}}
                    color={'white'}
                    name="trash-2"
                    size={18}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <FeatherIcon 
                    style={{backgroundColor:"#FC959F",borderRadius:12,marginHorizontal:2,padding:3}}
                    color={'white'}
                    name="edit-3"
                    size={18}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Subscriptions

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subtitle: {
    ...FONTS.fontRegular,
    fontSize: 15,
    textAlign: 'center',
    color: COLORS.title,
    marginBottom: 20,
  },
  loadingWrapper: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  loadingText: {
    ...FONTS.fontRegular,
    color: COLORS.title,
    marginTop: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    ...FONTS.fontRegular,
    fontSize: 16,
    color: '#999',
    marginTop: 15,
  },
  packageCard: {
    padding: 25,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    marginBottom: 20,
  },
  status: {
    ...FONTS.fontLight,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
  },
  centerBox: {
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  packageName: {
    ...FONTS.h2,
    color: COLORS.title,
    marginBottom: 5,
    textAlign: 'center',
  },
  packagePrice: {
    ...FONTS.h3,
    color: COLORS.title,
  },
  packageId: {
    ...FONTS.fontLight,
    color: COLORS.title,
    marginBottom: 10,
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoIcon: {
    marginRight: 8,
    backgroundColor: '#FDC9CE',
    padding: 14,
    borderRadius: 12,
  },
  infoLabel: {
    ...FONTS.fontSemiBold,
    color: COLORS.title,
  },
  infoValue: {
    ...FONTS.fontLight,
    color: COLORS.title,
    fontSize: 12,
  },
})