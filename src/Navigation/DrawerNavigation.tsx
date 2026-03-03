    import React from 'react';
    // import * as React from 'react';
    import { createDrawerNavigator } from '@react-navigation/drawer';
    import DrawerMenu from '../layout/DrawerMenu';
    import Home from '../Screens/Home';
    import Courses from '../Screens/Courses';
    import QuizHistory from '../Screens/QuizHistory';
    import VideoHistory from '../Screens/VideoHistory';
    import NotesHistory from '../Screens/NotesHistory';
    import Profile from '../Screens/Profile';
    import Security from '../Screens/Security';
    import Subscriptions from '../Screens/Subscriptions';
    import Invoices from '../Screens/Invoices';
    import Modules from '../Screens/Modules';
    import Lecture from '../Screens/Lecture';
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
    import { COLORS } from '../Constants/theme';
    import { DrawerParamList } from './DrawerParamList';
    import { SafeAreaView } from 'react-native-safe-area-context';
    import StackNavigator from './StackNavigator';


    const Drawer = createDrawerNavigator<DrawerParamList>();
    const DrawerNavigation = () => {

        return (
            <>
                <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.mainBackground }}>
                    <Drawer.Navigator
                        // initialRouteName='Home'
                        screenOptions={{
                            headerShown: false,
                            drawerType:'slide',
                            overlayColor:'transparent',
                        }}
                        drawerContent={(props) => {
                            return <DrawerMenu navigation={props.navigation} />
                        }}
                        >
                        <Drawer.Screen name='StackNavigator' component={StackNavigator} />
                        {/* <Drawer.Screen name='Courses' component={Courses} />
                        <Drawer.Screen name='QuizHistory' component={QuizHistory} />
                        <Drawer.Screen name='VideoHistory' component={VideoHistory} />
                        <Drawer.Screen name='NotesHistory' component={NotesHistory} />
                        <Drawer.Screen name='Profile' component={Profile} />
                        <Drawer.Screen name='Security' component={Security} />
                        <Drawer.Screen name='Subscriptions' component={Subscriptions} />
                        <Drawer.Screen name='Invoices' component={Invoices} /> */}
                        {/* <Drawer.Screen name='Modules' component={Modules} /> */}
                        {/* <Drawer.Screen name='Lecture' component={Lecture} /> */}
                        {/* <Drawer.Screen name='Videos' component={Videos} />
                        <Drawer.Screen name='ReadNotes' component={ReadNotes} />
                        <Drawer.Screen name='Quiz' component={Quiz} /> */}
                        {/* <Drawer.Screen name='Anatomy' component={Anatomy} /> */}
                        {/* <Drawer.Screen name='QuizCourses' component={QuizCourses} />
                        <Drawer.Screen name='SelectQuiz' component={SelectQuiz} /> */}
                        {/* <Drawer.Screen name='Library' component={Library} /> */}
                        {/* <Drawer.Screen name='Notes' component={Notes} /> */}
                        {/* <Drawer.Screen name='FavoriteQuiz' component={FavoriteQuiz} />
                        <Drawer.Screen name='FavoriteVideos' component={FavoriteVideos} /> */}
                        {/* <Drawer.Screen name='Favorite' component={Favorite} /> */}
                        {/* <Drawer.Screen name='FavoriteNotes' component={FavoriteNotes} /> */}
                        {/* <Drawer.Screen name='ChatForum' component={ChatForum} /> */}
                        {/* <Drawer.Screen name='QuizWarning' component={QuizWarning} /> */}
                        {/* <Drawer.Screen name='CreateQuiz' component={CreateQuiz} /> */}
                        {/* <Drawer.Screen name='Question' component={Question} /> */}
                        {/* <Drawer.Screen name='QuizResult' component={QuizResult} />
                        <Drawer.Screen name='QuizExplanations' component={QuizExplanations} />
                        <Drawer.Screen name='QuizExplanationsDetails' component={QuizExplanationsDetails} /> */}

                        
                    </Drawer.Navigator>
                </SafeAreaView>
            </>
        );
    };


    export default DrawerNavigation;