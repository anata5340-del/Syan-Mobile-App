import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';

import { COLORS, FONTS } from '../Constants/theme';
import { GlobalStyleSheet } from '../Constants/StyleSheet';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import Input from '../Components/Input';
import Button from '../Components/Button';
import HeaderOnboarding from '../layout/HeaderOnboarding';
import PopupMessage from '../Components/PopupMessage';
import { useSignup } from '../hooks/react-query/useSignup';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type SignUpScreenProps = StackScreenProps<RootStackParamList, 'SignUp'>;

// ─── Schema ────────────────────────────────────────────────────────────────────

const stepSchemas = [
  z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    jobDesignation: z.string().min(1, 'Job designation is required'),
  }),
  z.object({
    phone: z.string().min(7, 'Valid phone number required'),
    email: z.string().email('Valid email required'),
    cnic: z.string().min(5, 'CNIC / Passport is required'),
  }),
  z.object({
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  z.object({
    jobLocation: z.string().min(1, 'Job location is required'),
    institute: z.string().min(1, 'Institute is required'),
    jobDescription: z.string().min(1, 'Job description is required'),
  }),
  z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
  z.object({}),
];

const fullSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  jobDesignation: z.string().min(1, 'Job designation is required'),
  phone: z.string().min(7, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  cnic: z.string().min(5, 'CNIC / Passport is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  jobLocation: z.string().min(1, 'Job location is required'),
  institute: z.string().min(1, 'Institute is required'),
  jobDescription: z.string().min(1, 'Job description is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FullForm = z.infer<typeof fullSchema>;

// ─── Step config ───────────────────────────────────────────────────────────────

interface StepField {
  name: keyof FullForm;
  placeholder: string;
  icon: string;
  keyboardType?: string;
  type?: string;
}

interface StepConfig {
  label: string;
  title: string;
  subtitle: string;
  icon: string;
  fields: StepField[];
  customRender?: 'cnic';
}

const STEPS: StepConfig[] = [
  {
    label: 'Personal',
    title: 'Personal Information',
    subtitle: 'Let\'s start with the basics. Tell us a bit about yourself.',
    icon: 'user',
    fields: [
      { name: 'firstName', placeholder: 'First Name', icon: 'user' },
      { name: 'lastName', placeholder: 'Last Name', icon: 'users' },
      { name: 'jobDesignation', placeholder: 'Job Designation', icon: 'award' },
    ],
  },
  {
    label: 'Contact',
    title: 'Contact Information',
    subtitle: 'How can we reach you? We\'ll keep this private.',
    icon: 'phone',
    fields: [
      { name: 'phone', placeholder: 'Phone Number', icon: 'phone', keyboardType: 'phone-pad' },
      { name: 'email', placeholder: 'Email Address', icon: 'mail', keyboardType: 'email-address' },
      { name: 'cnic', placeholder: 'CNIC / Passport Number', icon: 'credit-card', keyboardType: 'number-pad' },
    ],
  },
  {
    label: 'Location',
    title: 'Your Location',
    subtitle: 'Where are you based? This helps us personalize your experience.',
    icon: 'map-pin',
    fields: [
      { name: 'address', placeholder: 'Street Address', icon: 'home' },
      { name: 'city', placeholder: 'City', icon: 'map-pin' },
      { name: 'country', placeholder: 'Country', icon: 'globe' },
    ],
  },
  {
    label: 'Professional',
    title: 'Professional Details',
    subtitle: 'Tell us about your professional background.',
    icon: 'briefcase',
    fields: [
      { name: 'jobLocation', placeholder: 'Job Location', icon: 'map' },
      { name: 'institute', placeholder: 'Institute / University', icon: 'book-open' },
      { name: 'jobDescription', placeholder: 'Job Description', icon: 'file-text' },
    ],
  },
  {
    label: 'Security',
    title: 'Set Your Password',
    subtitle: 'Create a secure password for your account.',
    icon: 'lock',
    fields: [
      { name: 'password', placeholder: 'Password', icon: 'lock', type: 'password' },
      { name: 'confirmPassword', placeholder: 'Confirm Password', icon: 'lock', type: 'password' },
    ],
  },
  {
    label: 'Documents',
    title: 'Upload CNIC',
    subtitle: 'Upload photos of your CNIC or ID card. You can skip this and add them later.',
    icon: 'camera',
    fields: [],
    customRender: 'cnic',
  },
];

const TOTAL_STEPS = STEPS.length;

// ─── Component ─────────────────────────────────────────────────────────────────

const SignUp = ({ navigation }: SignUpScreenProps) => {
  const { mutate: signupUser } = useSignup();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [cnicFront, setCnicFront] = useState<string | null>(null);
  const [cnicBack, setCnicBack] = useState<string | null>(null);
  const [popup, setPopup] = useState({
    visible: false,
    type: 'success' as 'success' | 'error',
    message: '',
  });

  const progressAnim = useRef(new Animated.Value(1 / TOTAL_STEPS)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef<ScrollView>(null);

  const {
    control,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FullForm>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      jobDesignation: '',
      phone: '',
      email: '',
      cnic: '',
      address: '',
      city: '',
      country: '',
      jobLocation: '',
      institute: '',
      jobDescription: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const animateProgress = useCallback((toStep: number) => {
    Animated.timing(progressAnim, {
      toValue: (toStep + 1) / TOTAL_STEPS,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progressAnim]);

  const animateTransition = useCallback((direction: 'next' | 'back', callback: () => void) => {
    const outValue = direction === 'next' ? -SCREEN_WIDTH * 0.3 : SCREEN_WIDTH * 0.3;
    const inValue = direction === 'next' ? SCREEN_WIDTH * 0.3 : -SCREEN_WIDTH * 0.3;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: outValue,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(inValue);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [slideAnim, fadeAnim]);

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const stepFields = STEPS[currentStep].fields.map(f => f.name);
    const schema = stepSchemas[currentStep];
    const values: Record<string, any> = {};
    stepFields.forEach(name => { values[name] = getValues(name); });

    const result = schema.safeParse(values);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue: z.ZodIssue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });
      setStepErrors(newErrors);

      await trigger(stepFields as any);
      return false;
    }

    setStepErrors({});
    return true;
  }, [currentStep, getValues, trigger]);

  const handleNext = useCallback(async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;

    if (currentStep < TOTAL_STEPS - 1) {
      const nextStep = currentStep + 1;
      animateTransition('next', () => setCurrentStep(nextStep));
      animateProgress(nextStep);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [currentStep, validateCurrentStep, animateTransition, animateProgress]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      animateTransition('back', () => setCurrentStep(prevStep));
      animateProgress(prevStep);
      setStepErrors({});
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [currentStep, animateTransition, animateProgress]);

  const pickCnicImage = useCallback(async (side: 'front' | 'back') => {
    try {
      const image = await ImagePicker.openPicker({
        width: 800,
        height: 500,
        cropping: true,
        compressImageQuality: 0.8,
        
      
        // cropperStatusBarColor: '#000000',
        cropperToolbarColor: '#000000',
        cropperToolbarTitle: 'Crop CNIC Image',
        cropperToolbarWidgetColor: '#ffffff',
        hideBottomControls: false,
        freeStyleCropEnabled: true,
      });
      if (side === 'front') {
        setCnicFront(image.path);
      } else {
        setCnicBack(image.path);
      }
    } catch (e: any) {
      if (e?.code !== 'E_PICKER_CANCELLED') {
        console.log('Image picker error:', e);
      }
    }
  }, []);

  const onFinalSubmit = useCallback(async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;

    setIsSubmitting(true);
    const allValues = getValues();

    const { confirmPassword, ...rest } = allValues;
    const payload = {
      ...rest,
      jobStatus: rest.jobDesignation,
    };

    signupUser(
      {
        payload,
        files: { cnicFront, cnicBack },
      },
      {
        onSuccess: () => {
          setPopup({
            visible: true,
            type: 'success',
            message: 'Account created! Your account is pending approval.',
          });
          setTimeout(() => {
            navigation.navigate('SignIn');
          }, 2000);
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.error?.message ||
            err?.response?.data?.message ||
            err?.message ||
            'Registration failed. Please try again.';
          setPopup({
            visible: true,
            type: 'error',
            message: msg,
          });
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      },
    );
  }, [validateCurrentStep, getValues, signupUser, navigation, cnicFront, cnicBack]);

  const step = STEPS[currentStep];

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <HeaderOnboarding />
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          {/* Step indicator dots + labels */}
          <View style={styles.stepsRow}>
            {STEPS.map((s, i) => {
              const isCompleted = i < currentStep;
              const isActive = i === currentStep;
              return (
                <View key={s.label} style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepDot,
                      isCompleted && styles.stepDotCompleted,
                      isActive && styles.stepDotActive,
                    ]}
                  >
                    {isCompleted ? (
                      <FeatherIcon name="check" size={12} color="#fff" />
                    ) : (
                      <Text
                        style={[
                          styles.stepDotText,
                          (isActive || isCompleted) && styles.stepDotTextActive,
                        ]}
                      >
                        {i + 1}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isActive && styles.stepLabelActive,
                      isCompleted && styles.stepLabelCompleted,
                    ]}
                  >
                    {s.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Connecting progress bar */}
          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <Text style={styles.stepCounter}>
            Step {currentStep + 1} of {TOTAL_STEPS}
          </Text>
        </View>

        {/* Scrollable form content */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{
              transform: [{ translateX: slideAnim }],
              opacity: fadeAnim,
            }}
          >
            {/* Step header */}
            <View style={styles.stepHeader}>
              <View style={styles.stepIconCircle}>
                <FeatherIcon name={step.icon} size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
            </View>

            {/* Form fields */}
            {step.customRender === 'cnic' ? (
              <View style={styles.fieldsContainer}>
                {/* CNIC Front */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => pickCnicImage('front')}
                  style={styles.cnicUploadBox}
                >
                  {cnicFront ? (
                    <Image source={{ uri: cnicFront }} style={styles.cnicImage} />
                  ) : (
                    <View style={styles.cnicPlaceholder}>
                      <View style={styles.cnicIconCircle}>
                        <FeatherIcon name="camera" size={24} color={COLORS.primary} />
                      </View>
                      <Text style={styles.cnicLabel}>Upload CNIC Front</Text>
                      <Text style={styles.cnicHint}>Tap to select image</Text>
                    </View>
                  )}
                  {cnicFront && (
                    <TouchableOpacity
                      style={styles.cnicRemoveBtn}
                      onPress={() => setCnicFront(null)}
                    >
                      <FeatherIcon name="x" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>

                {/* CNIC Back */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => pickCnicImage('back')}
                  style={styles.cnicUploadBox}
                >
                  {cnicBack ? (
                    <Image source={{ uri: cnicBack }} style={styles.cnicImage} />
                  ) : (
                    <View style={styles.cnicPlaceholder}>
                      <View style={styles.cnicIconCircle}>
                        <FeatherIcon name="camera" size={24} color={COLORS.primary} />
                      </View>
                      <Text style={styles.cnicLabel}>Upload CNIC Back</Text>
                      <Text style={styles.cnicHint}>Tap to select image</Text>
                    </View>
                  )}
                  {cnicBack && (
                    <TouchableOpacity
                      style={styles.cnicRemoveBtn}
                      onPress={() => setCnicBack(null)}
                    >
                      <FeatherIcon name="x" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.fieldsContainer}>
                {step.fields.map((field) => (
                  <View key={field.name} style={styles.fieldWrapper}>
                    <Controller
                      control={control}
                      name={field.name}
                      render={({ field: { onChange, value, onBlur } }) => (
                        <Input
                          placeholder={field.placeholder}
                          value={value}
                          onBlur={onBlur}
                          onChangeText={(val: string) => {
                            onChange(val);
                            if (stepErrors[field.name]) {
                              setStepErrors(prev => {
                                const copy = { ...prev };
                                delete copy[field.name];
                                return copy;
                              });
                            }
                          }}
                          type={field.type}
                          keyboardType={field.keyboardType as any}
                          icon={
                            <FeatherIcon
                              name={field.icon}
                              size={20}
                              color={stepErrors[field.name] ? '#e74c3c' : COLORS.title}
                            />
                          }
                        />
                      )}
                    />
                    {stepErrors[field.name] && (
                      <View style={styles.errorRow}>
                        <FeatherIcon name="alert-circle" size={13} color="#e74c3c" />
                        <Text style={styles.errorText}>{stepErrors[field.name]}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </Animated.View>

          {/* Navigation buttons */}
          <View style={styles.buttonsContainer}>
            {currentStep === TOTAL_STEPS - 1 ? (
              <Button
                title={isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                onPress={onFinalSubmit}
                color={COLORS.primary}
                style={{ borderRadius: 52 }}
              />
            ) : (
              <Button
                title="CONTINUE"
                onPress={handleNext}
                color={COLORS.primary}
                style={{ borderRadius: 52 }}
              />
            )}

            {currentStep > 0 && (
              <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.6}
                style={styles.backButton}
              >
                <FeatherIcon name="arrow-left" size={16} color={COLORS.title} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            )}

            {currentStep === 0 && (
              <View style={styles.signinRow}>
                <Text style={styles.signinLabel}>Already have an account?</Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => navigation.navigate('SignIn')}
                >
                  <Text style={styles.signinLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <PopupMessage
        type={popup.type}
        message={popup.message}
        visible={popup.visible}
        onClose={() => setPopup({ ...popup, visible: false })}
      />
    </SafeAreaView>
  );
};

export default SignUp;

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.mainBackground,
  },

  // Progress section
  progressSection: {
    paddingHorizontal: 30,
    paddingTop: 18,
    paddingBottom: 6,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  stepDotActive: {
    backgroundColor: COLORS.primary + '18',
    borderColor: COLORS.primary,
  },
  stepDotCompleted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepDotText: {
    ...FONTS.fontSemiBold,
    fontSize: 11,
    color: '#999',
  },
  stepDotTextActive: {
    color: COLORS.primary,
  },
  stepLabel: {
    ...FONTS.fontRegular,
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  stepLabelActive: {
    ...FONTS.fontSemiBold,
    color: COLORS.primary,
  },
  stepLabelCompleted: {
    ...FONTS.fontMedium,
    color: COLORS.primary,
  },

  // Progress bar
  progressBarTrack: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  stepCounter: {
    ...FONTS.fontRegular,
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },

  // Scroll content
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 40,
    flexGrow: 1,
  },

  // Step header
  stepHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary + '14',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  stepTitle: {
    ...FONTS.fontSemiBold,
    fontSize: 22,
    color: COLORS.title,
    marginBottom: 6,
    textAlign: 'center',
  },
  stepSubtitle: {
    ...FONTS.fontRegular,
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 10,
  },

  // Fields
  fieldsContainer: {
    marginBottom: 14,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingLeft: 4,
    gap: 5,
  },
  errorText: {
    ...FONTS.fontRegular,
    color: '#e74c3c',
    fontSize: 12,
  },

  // Buttons
  buttonsContainer: {
    marginTop: 8,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
    paddingVertical: 8,
  },
  backText: {
    ...FONTS.fontMedium,
    fontSize: 14,
    color: COLORS.title,
  },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 5,
  },
  signinLabel: {
    ...FONTS.fontRegular,
    fontSize: 14,
    color: COLORS.title,
    opacity: 0.5,
  },
  signinLink: {
    ...FONTS.fontMedium,
    fontSize: 14,
    color: COLORS.primary,
  },

  // CNIC Upload
  cnicUploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.inputborder,
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  cnicPlaceholder: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cnicIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary + '14',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cnicLabel: {
    ...FONTS.fontMedium,
    fontSize: 14,
    color: COLORS.title,
    marginBottom: 3,
  },
  cnicHint: {
    ...FONTS.fontRegular,
    fontSize: 12,
    color: '#999',
  },
  cnicImage: {
    width: '100%',
    height: 170,
    resizeMode: 'cover',
  },
  cnicRemoveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
