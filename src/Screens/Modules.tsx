import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import { COLORS, FONTS } from '../Constants/theme';

import MainHeader from '../layout/MainHeader';
import { useVideoCourseById } from '../hooks/react-query/useVideoCourses';
import Loader from '../Components/Loader';
import EmptyState from '../Components/EmptyState';

type Props = StackScreenProps<RootStackParamList, "Modules">;

const Modules = ({ navigation, route }: Props) => {
  const { courseId } = route.params;
console.log("Course ID:", courseId);
  const { data, isLoading, isError, refetch } = useVideoCourseById(courseId);
  console.log("Modules Data:", data);
  const modules = data?.modules || [];
  const moduleId = data?.modules?._id || "";
  console.log("Modules List:", modules);


 if (!isLoading && (isError || modules.length === 0)) {
  const isNoData = modules.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.mainBackground }}>
      <MainHeader screenName={data?.videoCourses?.module?.name || "Modules"} />

      <EmptyState
        type={isNoData ? "noData" : "error"}
        message={isNoData ? "No modules available." : "Failed to load modules."}
        showButton
        buttonText={isNoData ? "Go Back" : "Try Again"}
        onRetry={isNoData ? () => navigation.goBack() : refetch}
      />
    </View>
  );
 }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.mainBackground }}>
      <MainHeader screenName={data?.videoCourses?.module?.name || "Modules"} />

      <ScrollView 
        contentContainerStyle={{
          paddingVertical: 10,
          paddingBottom: 50,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            paddingHorizontal: 20,
          }}
        >

          {/* Loader */}
          {isLoading && (
            <Loader visible={true} />
          )}


          {modules.map((mod : any) => (
            <TouchableOpacity
              key={mod._id}
              style={{
                backgroundColor: mod.color || "#FFF0F2",
                borderWidth: 1,
                borderColor: mod.borderColor || "#ffffffff",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: "5%",
                borderRadius: 5,
                width: 95,
                marginBottom: 12,
              }}
              onPress={() => 
                navigation.navigate("Lecture", {
                  moduleId: mod._id,
                  moduleName: mod.name,
                  courseId: courseId,
                })
              }
            >
              <Text
                style={[
                  FONTS.fontSemiBold,
                  { fontSize: 12, color: "black" }
                ]}
                numberOfLines={1}
              >
                {mod.name}
              </Text>

              <Text
                style={[
                  FONTS.fontLight,
                  { fontSize: 11, color: "black" }
                ]}
              >
                Topic: {mod.topic}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Modules;
