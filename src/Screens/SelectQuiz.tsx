
import { View, Text, ScrollView, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../Constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import MainHeader from '../layout/MainHeader';
import FeatherIcon from 'react-native-vector-icons/Feather';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'SelectQuiz'>;

const SelectQuiz = ({ navigation, route }: HomeScreenProps) => {

    const { quizId, quizName } = route.params;

    return (
        <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
            <MainHeader screenName="Select Quiz " />
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, }} showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        marginHorizontal: -15,
                        paddingHorizontal: 10,
                    }}>



                    <TouchableOpacity onPress={() => navigation.navigate("CreateQuiz", { quizId })} style={{
                        backgroundColor: "#EEEEEE",
                        justifyContent: "center",
                        alignItems: 'center',
                        borderRadius: 10,
                        marginVertical: '2%',
                        paddingHorizontal: '5%',
                        paddingVertical: "10%"
                    }}>
                        <View>
                            <FeatherIcon name="edit-3" size={50} color={'black'} />
                        </View>
                        <View style={{
                            paddingVertical: 20
                        }}>
                            <Text style={[FONTS.fontSemiBold, { fontSize: 19, color: 'black' }]}>Create your own quiz</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate("CreateQuiz", { quizId })} style={{
                            backgroundColor: "#F9954B",
                            paddingHorizontal: 15,
                            paddingVertical: 4,
                            borderRadius: 22
                        }}>
                            <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: 'white' }]}>Start Creating</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => navigation.navigate("Library", { quizId, quizName })} style={{
                        backgroundColor: "#EEEEEE",
                        justifyContent: "center",
                        alignItems: 'center',
                        borderRadius: 10,
                        marginVertical: '3%',
                        paddingHorizontal: '5%',
                        paddingVertical: "10%"
                    }}>
                        <View>
                            <FeatherIcon name="book-open" size={50} color={'black'} />
                        </View>
                        <View style={{
                            paddingVertical: 20
                        }}>
                            <Text style={[FONTS.fontSemiBold, { fontSize: 19, color: 'black' }]}>Library</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate("Library", { quizId, quizName })} style={{
                            backgroundColor: "#F9954B",
                            paddingHorizontal: 15,
                            paddingVertical: 4,
                            borderRadius: 22
                        }}>
                            <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: 'white' }]}>Go to Library</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

export default SelectQuiz

const styles = StyleSheet.create({})