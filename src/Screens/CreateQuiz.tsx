import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { GlobalStyleSheet } from "../Constants/StyleSheet";
import { COLORS, FONTS } from "../Constants/theme";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../Navigation/RootStackParamList";
import MainHeader from "../layout/MainHeader";
import Icon from "react-native-vector-icons/MaterialIcons";
import Button from "../Components/Button";
import { useQuizById } from "../hooks/react-query/useQuizes";
import Loader from "../Components/Loader";
import { useQuestionStatuses } from "../hooks/react-query/useFavorites";

type Props = StackScreenProps<RootStackParamList, "CreateQuiz">;

type QuestionMode = "all" | "unused" | "marked" | "incorrect";

type FilteredResult = {
  unused: any[];
  correct: any[];
  incorrect: any[];
};

const CreateQuiz = ({ navigation, route }: Props) => {
  const { quizId } = route.params;

  const [questionMode, setQuestionMode] = useState<QuestionMode>("all");
  const [expandedSystems, setExpandedSystems] = useState<number[]>([]);
  const [selectedSystems, setSelectedSystems] = useState<Record<string, any>>({});
  const [filteredQuestions, setFilteredQuestions] = useState<FilteredResult>({
    unused: [],
    correct: [],
    incorrect: [],
  });

  const { data, isLoading, isError } = useQuizById(quizId);
  const { data: questionStatusesData, isLoading: statusesLoading } = useQuestionStatuses();

  const quiz = data?.data?.quiz;
  const systems = quiz?.customQuestions || [];
  const questionStatuses = questionStatusesData || [];

  console.log('Quiz ID:', quizId);
  console.log('Quiz Data:', data);
  console.log('Question Statuses:', questionStatuses);

  // Filter questions based on their statuses
  const filterQuestions = (topics: any[], statuses: any[]): FilteredResult => {
    const statusMap: Record<string, boolean> = statuses.reduce(
      (acc, status) => {
        acc[status.questionId] = status.correct;
        return acc;
      },
      {} as Record<string, boolean>
    );

    console.log('Status Map:', statusMap);

    return {
      unused: topics.map((topic) => ({
        ...topic,
        subTopics: topic.subTopics.map((subTopic: any) => ({
          ...subTopic,
          questions: subTopic.questions.filter(
            (questionId: string) => !(questionId in statusMap)
          ),
        })),
      })),
      correct: topics.map((topic) => ({
        ...topic,
        subTopics: topic.subTopics.map((subTopic: any) => ({
          ...subTopic,
          questions: subTopic.questions.filter(
            (questionId: string) => statusMap[questionId] === true
          ),
        })),
      })),
      incorrect: topics.map((topic) => ({
        ...topic,
        subTopics: topic.subTopics.map((subTopic: any) => ({
          ...subTopic,
          questions: subTopic.questions.filter(
            (questionId: string) => statusMap[questionId] === false
          ),
        })),
      })),
    };
  };

  // Update filtered questions when statuses or systems change
  useEffect(() => {
    if (systems.length > 0 && questionStatuses.length > 0) {
      const filteredResult = filterQuestions(systems, questionStatuses);
      setFilteredQuestions(filteredResult);
      console.log('Filtered Questions:', filteredResult);
    }
  }, [systems, questionStatuses]);

  // Count total Questions
  const totalQuestions = systems.reduce(
    (sum: any, system: { subTopics: any[] }) =>
      sum + system.subTopics.reduce((subSum, sub) => subSum + sub.questions.length, 0),
    0
  );

  // Count filtered questions
  const getFilteredCount = (mode: QuestionMode): number => {
    let filtered: any[] = [];
    
    if (mode === "all") {
      filtered = systems;
    } else if (mode === "unused") {
      filtered = filteredQuestions.unused;
    } else if (mode === "marked") {
      filtered = filteredQuestions.correct;
    } else if (mode === "incorrect") {
      filtered = filteredQuestions.incorrect;
    }

    return filtered.reduce(
      (acc, topic) =>
        acc +
        topic.subTopics.reduce(
          (subAcc: number, subTopic: any) => subAcc + subTopic.questions.length,
          0
        ),
      0
    );
  };

  const filters = [
    { name: "Unused", count: getFilteredCount("unused"), mode: "unused" as QuestionMode },
    { name: "Incorrect", count: getFilteredCount("incorrect"), mode: "incorrect" as QuestionMode },
    { name: "Marked", count: getFilteredCount("marked"), mode: "marked" as QuestionMode },
    { name: "All", count: totalQuestions, mode: "all" as QuestionMode },
  ];

  // Calculate selected questions count and collect topic IDs
  const { selectedCount, selectedTopicIds } = useMemo(() => {
    let count = 0;
    const topicIds: string[] = [];

    // Get the questions to render based on current mode
    const questionsToRender =
      questionMode === "all"
        ? systems
        : questionMode === "unused"
        ? filteredQuestions.unused
        : questionMode === "marked"
        ? filteredQuestions.correct
        : filteredQuestions.incorrect;

    Object.keys(selectedSystems).forEach((systemIndex) => {
      const system = questionsToRender[parseInt(systemIndex)];
      if (!system) return;

      const selections = selectedSystems[systemIndex];

      Object.keys(selections).forEach((key) => {
        if (key === "__allSelected") return;

        const subIndex = parseInt(key);
        if (selections[subIndex]) {
          const subTopic = system.subTopics[subIndex];
          if (!subTopic) return;

          count += subTopic.questions.length;
          if (subTopic._id) {
            topicIds.push(subTopic._id);
          }
        }
      });
    });

    return { selectedCount: count, selectedTopicIds: topicIds };
  }, [selectedSystems, systems, questionMode, filteredQuestions]);

  const toggleSystem = (index: number) => {
    setExpandedSystems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleSystemSelection = (index: number, subIndex: number | null = null) => {
    setSelectedSystems((prev) => {
      const newState = { ...prev };
      
      // Get the questions to render based on current mode
      const questionsToRender =
        questionMode === "all"
          ? systems
          : questionMode === "unused"
          ? filteredQuestions.unused
          : questionMode === "marked"
          ? filteredQuestions.correct
          : filteredQuestions.incorrect;

      const system = questionsToRender[index];

      if (subIndex !== null) {
        // Toggle individual subtopic
        newState[index] = {
          ...newState[index],
          [subIndex]: !newState[index]?.[subIndex],
        };

        // Update topic checkbox state if all subtopics are selected
        const allSelected = system.subTopics.every((_: any, i: string | number) => 
          newState[index][i]
        );
        
        if (allSelected) {
          newState[index].__allSelected = true;
        } else {
          delete newState[index].__allSelected;
          // Remove the object entirely if no subtopics are selected
          if (!Object.keys(newState[index]).filter(k => k !== '__allSelected').length) {
            delete newState[index];
          }
        }
      } else {
        // Toggle all subtopics
        const isSelected = newState[index]?.__allSelected;
        if (isSelected) {
          // Deselect all
          delete newState[index];
        } else {
          // Select all
          newState[index] = {};
          system.subTopics.forEach((_: any, i: string | number) => {
            newState[index][i] = true;
          });
          newState[index].__allSelected = true;
        }
      }

      console.log('Updated selection state:', newState);
      return newState;
    });
  };

  const handleCreateQuiz = () => {
    if (selectedTopicIds.length === 0) {
      return;
    }

    const topicIdsString = selectedTopicIds.join(',');
    console.log('Quiz ID:', quizId);
    console.log('Selected Topic IDs:', selectedTopicIds);
    console.log('Topic IDs String:', topicIdsString);
    console.log('Question Limit:', selectedCount);
    console.log('Total Selected Questions:', selectedCount);

    // Navigate to QuizWarning with custom quiz params
    navigation.navigate('QuizWarning', {
      type: 'custom',
      quizId: quizId,
      topicId: topicIdsString,
      limit: selectedCount || undefined,
      quizName: quiz?.name || 'Custom Quiz',
      estimatedQuestions: selectedCount,
    });
    console.log("topics selected ids", topicIdsString);
  };

  const renderSystem = ({ item, index }: any) => {
    const totalQuestions = item.subTopics.reduce(
      (sum: number, sub: any) => sum + sub.questions.length,
      0
    );

    return (
      <View key={index} style={styles.systemItem}>
        <TouchableOpacity
          onPress={() => toggleSystem(index)}
          style={styles.systemHeader}
        >
          <Icon
            name={expandedSystems.includes(index) ? "expand-more" : "chevron-right"}
            size={24}
            color={COLORS.text}
          />

          <TouchableOpacity
            onPress={() => toggleSystemSelection(index)}
            style={[
              styles.checkbox,
              selectedSystems[index] && styles.checkboxSelected,
            ]}
          >
            {selectedSystems[index] && (
              <Icon name="check" size={16} color={COLORS.white} />
            )}
          </TouchableOpacity>

          <Text style={[styles.systemName, FONTS.fontLight]}>
            {item.topic.name}
          </Text>

          <Text style={[styles.systemCount, FONTS.fontLight]}>
            {totalQuestions}
          </Text>
        </TouchableOpacity>

        {expandedSystems.includes(index) && (
          <FlatList
            data={item.subTopics}
            keyExtractor={(_, subIndex) => subIndex.toString()}
            renderItem={({ item: sub, index: subIndex }) =>
              renderSubsystem({ item: sub, index: subIndex, systemIndex: index })
            }
            scrollEnabled={false}
            style={styles.subsystemList}
          />
        )}
      </View>
    );
  };

  const renderSubsystem = ({ item, index: subIndex, systemIndex }: any) => (
    <View key={subIndex} style={styles.subsystemItem}>
      <TouchableOpacity
        onPress={() => toggleSystemSelection(systemIndex, subIndex)}
        style={[
          styles.checkbox,
          selectedSystems[systemIndex]?.[subIndex] && styles.checkboxSelected,
        ]}
      >
        {selectedSystems[systemIndex]?.[subIndex] && (
          <Icon name="check" size={16} color={COLORS.white} />
        )}
      </TouchableOpacity>

      <Text style={[styles.subsystemName, FONTS.fontLight]}>{item.name}</Text>

      <Text style={styles.subsystemCount}>{item.questions.length}</Text>
    </View>
  );

  const renderQuestions = () => {
    const questionsToRender =
      questionMode === "all"
        ? systems
        : questionMode === "unused"
        ? filteredQuestions.unused
        : questionMode === "marked"
        ? filteredQuestions.correct
        : filteredQuestions.incorrect;

    return questionsToRender;
  };

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader screenName="Create Quiz" />

      {(isLoading || statusesLoading) && <Loader visible={true} />}

      {isError && (
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.mainBackground,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "red" }}>Failed to load quiz data.</Text>
        </View>
      )}

      <View style={[GlobalStyleSheet.container, { flex: 1 }]}>
        <View style={{ justifyContent: "center", alignItems: "center", marginBottom: "5%" }}>
          <Text style={[FONTS.fontRegular, { fontSize: 16, color: COLORS.text }]}>
            Question Mode
          </Text>
          <Text style={[FONTS.fontRegular, { fontSize: 14, color: COLORS.primary, marginTop: 8 }]}>
            {quiz?.name}
          </Text>
        </View>

        {/* FILTER SECTION */}
        <View style={styles.filterContainer}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f.name}
              onPress={() => setQuestionMode(f.mode)}
              style={styles.filterOption}
            >
              <View style={[styles.radio, questionMode === f.mode && styles.radioSelected]} />
              <Text style={[styles.filterText, FONTS.fontRegular]}>{f.name}</Text>
              <Text style={{ width: 40, textAlign: "center", color: COLORS.text }}>
                {f.count}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.subtitle, FONTS.fontSemiBold]}>Systems</Text>

        <FlatList
          data={renderQuestions()}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderSystem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </View>

      {/* Bottom Section with Selected Count and Button */}
      <View style={[GlobalStyleSheet.container, { paddingTop: 0 }]}>
        {selectedCount > 0 && (
          <View style={styles.selectionInfo}>
            <Text style={[FONTS.fontSemiBold, { color: COLORS.text, fontSize: 14 }]}>
              Selected: {selectedCount} questions from {selectedTopicIds.length} topics
            </Text>
          </View>
        )}

        <Button
          onPress={handleCreateQuiz}
          title={selectedCount > 0 ? `Create Quiz (${selectedCount} Questions)` : "Select Topics"}
          color={selectedCount > 0 ? COLORS.primary : COLORS.label}
          text={COLORS.card}
          style={{ borderRadius: 50 }}
          disabled={selectedCount === 0}
        />
      </View>
    </View>
  );
};

export default CreateQuiz;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#227777",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.text,
  },
  filterContainer: {
    backgroundColor: COLORS.light_blue,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.label,
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: COLORS.blue,
  },
  filterText: {
    fontSize: 15,
    flex: 1,
    color: COLORS.text,
  },
  countInput: {
    borderWidth: 1,
    borderColor: COLORS.label,
    borderRadius: 4,
    padding: 4,
    width: 50,
    textAlign: "center",
    color: COLORS.text,
  },
  systemList: {
    flex: 1,
  },
  systemItem: {
    marginBottom: 8,
  },
  systemHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 6,
    borderRadius: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 0.9,
    borderColor: COLORS.blue,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  systemName: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
  },
  systemCount: {
    fontSize: 12,
    borderWidth: 1,
    borderColor: COLORS.blue,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: COLORS.blue,
    textAlign: "center",
  },
  subsystemList: {
    marginLeft: "17%",
    marginVertical: 8,
  },
  subsystemItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  subsystemName: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text,
  },
  subsystemCount: {
    fontSize: 12,
    borderWidth: 1,
    borderColor: COLORS.blue,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: COLORS.blue,
    textAlign: "center",
  },
  selectionInfo: {
    backgroundColor: COLORS.light_blue,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
});