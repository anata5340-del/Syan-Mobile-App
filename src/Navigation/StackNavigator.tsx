import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParamList';
import { View } from 'react-native';




import Home from '../Screens/Home';
import Onboarding from '../Screens/Onboarding';
import SignIn from '../Screens/SignIn';
import SignUp from '../Screens/SignUp';
import ForgotPassword from '../Screens/ForgotPassword';
import OTP from '../Screens/OTP';
import ResetPassword from '../Screens/ResetPassword';
import BottomNavigation from './BottomNavigation';
import QuizHistory from '../Screens/QuizHistory';
import VideoHistory from '../Screens/VideoHistory';
import NotesHistory from '../Screens/NotesHistory';
import Profile from '../Screens/Profile';
import Security from '../Screens/Security';
import Subscriptions from '../Screens/Subscriptions';
import Invoices from '../Screens/Invoices';
import Courses from '../Screens/Courses';
import Modules from '../Screens/Modules';
import Lecture from '../Screens/Lecture';
import Vidoes from '../Screens/Vidoes';
import Videos from '../Screens/Vidoes';
import ReadNotes from '../Screens/ReadNotes';
import Quiz from '../Screens/Quiz';
import Anatomy from '../Screens/Anatomy';
import QuizCourses from '../Screens/QuizCourses';
import SelectQuiz from '../Screens/SelectQuiz';
import Library from '../Screens/Library';
import Notes from '../Screens/Notes';
import Favorite from '../Screens/Favorite';
import FavoriteQuiz from '../Screens/FavoriteQuiz';
import FavoriteVideos from '../Screens/FavoriteVideos';
import FavoriteNotes from '../Screens/FavoriteNotes';
import ChatForum from '../Screens/ChatForum';
import QuizWarning from '../Screens/QuizWarning';
import CreateQuiz from '../Screens/CreateQuiz';
import Question from '../Screens/Question';
import QuizResult from '../Screens/QuizResult';
import QuizExplanations from '../Screens/QuizExplanations';
import QuizExplanationsDetails from '../Screens/QuizExplanationsDetails';
import LearningTabs from '../Screens/LearningContainer';
import VideoPlayer from '../Screens/VideoPlayer';


const Stack = createStackNavigator<RootStackParamList>();


const StackNavigator = () => {


    return(
        <View style={{width : '100%',flex:1}}>
            <Stack.Navigator
				initialRouteName='Home'
				screenOptions={{
					headerShown:false,
					cardStyle: { backgroundColor: "transparent" },
					cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
				}}
			>
                <Stack.Screen name="QuizHistory" component={QuizHistory} />
                <Stack.Screen name="VideoHistory" component={VideoHistory} />
                <Stack.Screen name="NotesHistory" component={NotesHistory} />
                <Stack.Screen name='Profile' component={Profile} />
                <Stack.Screen name='Security' component={Security} />
                <Stack.Screen name='Subscriptions' component={Subscriptions} />
                <Stack.Screen name='Invoices' component={Invoices} />
                <Stack.Screen name='Courses' component={Courses} />
                <Stack.Screen name='Modules' component={Modules} />
                <Stack.Screen name='Lecture' component={Lecture} />
                <Stack.Screen name='Videos' component={Videos} />
                <Stack.Screen name='VideoPlayer' component={VideoPlayer} />
                <Stack.Screen name='ReadNotes' component={ReadNotes} />
                <Stack.Screen name='Quiz' component={Quiz} />
                <Stack.Screen name='Anatomy' component={Anatomy} />
                <Stack.Screen name='QuizCourses' component={QuizCourses} />
                <Stack.Screen name='SelectQuiz' component={SelectQuiz} />
                <Stack.Screen name='Library' component={Library} />
                <Stack.Screen name='Notes' component={Notes} />
                <Stack.Screen name='Favorite' component={Favorite} />
                <Stack.Screen name='FavoriteQuiz' component={FavoriteQuiz} />
                <Stack.Screen name='FavoriteVideos' component={FavoriteVideos} />
                <Stack.Screen name='FavoriteNotes' component={FavoriteNotes} />
                <Stack.Screen name="ChatForum" component={ChatForum} />
                <Stack.Screen name="QuizWarning" component={QuizWarning} />
                <Stack.Screen name="CreateQuiz" component={CreateQuiz} />
                <Stack.Screen name="Question" component={Question} />
                <Stack.Screen name="QuizResult" component={QuizResult} />
                <Stack.Screen name="QuizExplanations" component={QuizExplanations} />
                <Stack.Screen name="QuizExplanationsDetails" component={QuizExplanationsDetails} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="LearningTabs" component={LearningTabs} />
            </Stack.Navigator>
        </View>
    )
}


export default StackNavigator;