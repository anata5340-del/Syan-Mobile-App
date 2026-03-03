import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";


import { COLORS, FONTS } from "../Constants/theme";
import MainHeader from "../layout/MainHeader";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../Navigation/RootStackParamList";

import { useQuizById } from "../hooks/react-query/useQuizes";
import Loader from "../Components/Loader";
import EmptyState from "../Components/EmptyState";

type Props = StackScreenProps<RootStackParamList, "Library">;

const Library = ({ navigation, route }: Props) => {
  const { quizId } = route.params;

  const { data, isLoading, isError, refetch } = useQuizById(quizId);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.mainBackground, justifyContent: "center" }}>
        <Loader visible={true} />
      </View>
    );
  }

  if (isError || !data?.data.quiz) {
    const isNoData = data?.data.quiz.length === 0;
    return (
    <View style={{ flex: 1, backgroundColor: COLORS.mainBackground }}>
      <MainHeader screenName={data?.data?.quiz?.name || "Library"} />

      <EmptyState
        type={isNoData ? "noData" : "error"}
        message={isNoData ? "No data available." : "Failed to load Library."}
        showButton
        buttonText={isNoData ? "Go Back" : "Try Again"}
        onRetry={isNoData ? () => navigation.goBack() : refetch}
      />
    </View>
  );
  }

  const quiz = data.data.quiz;
  console.log("Quiz Data:", quiz);
  const papers = quiz.library?.papers || [];

  console.log("Library Papers:", papers);

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader screenName="Quiz Library" />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginHorizontal: -15, paddingHorizontal: 10 }}>
          {papers.length === 0 && (
            <Text
              style={[
                FONTS.fontRegular,
                {
                  color: COLORS.text,
                  fontSize: 16,
                  marginTop: 30,
                  textAlign: "center",
                },
              ]}
            >
              No Library Papers Available
            </Text>
          )}

          {papers.map((paper : any) => (
            <View
              key={paper._id}
              style={[
                styles.paperCard,
                { backgroundColor: paper.color }, // you can replace with paper.color if boxed
              ]}
            >
              {/* HEADER */}
              <View style={styles.headerRow}>
                <Text style={[FONTS.fontSemiBold, styles.paperTitle]}>
                  {paper.name}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("QuizWarning", {
                      quizId,
                      paperId: paper._id,
                      type: "library",
                    })
                  }
                  style={styles.startButton}
                >
                  <Text style={[FONTS.fontRegular, styles.startButtonText]}>
                    Start
                  </Text>
                </TouchableOpacity>
              </View>

              {/* FOOTER */}
              <View style={styles.footerRow}>
                <TouchableOpacity style={styles.totalButton}>
                  <Text style={[FONTS.fontRegular, styles.totalButtonText]}>
                    Total {paper.questions.length}
                  </Text>
                </TouchableOpacity>

                <Image
                  source={{ uri: paper.icon }}
                  style={{ width: 70, height: 70, resizeMode: "contain" }}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Library;

const styles = StyleSheet.create({
  paperCard: {
    borderRadius: 20,
    marginVertical: "3%",
    paddingHorizontal: "7%",
    paddingVertical: "7%",
    height: 166,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  paperTitle: {
    fontSize: 19,
    color: COLORS.title,
  },
  startButton: {
    backgroundColor: "#01B067",
    paddingHorizontal: 25,
    justifyContent: "center",
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 14,
    color: "white",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "4%",
  },
  totalButton: {
    backgroundColor: "#F9954B",
    paddingHorizontal: 25,
    justifyContent: "center",
    borderRadius: 12,
  },
  totalButtonText: {
    fontSize: 14,
    color: "white",
  },
});
