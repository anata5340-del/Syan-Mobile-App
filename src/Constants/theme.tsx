import { Dimensions } from "react-native";
const {width,height} = Dimensions.get('screen');



export const COLORS = {
    primary : '#EF6A77',
    secondary : '#227777',
    blue : '#4FB1C1',
    orange : '#F9954B',
    light_pink : '#FDC9CE',
    light_blue : '#CEEAFF',
    light_brown : '#FFD0AD',
    light_purple : '#EECEFF',
	modal_background : '#FFE3E6',
	video_images_background : '#7C0712',
	small_card_background : '#FFF1F3',
    green : '#01B067',
    gray : '#EBEBEB',
    black : '#2E2E2E',
    white: "#fff",
    text : "#1B1B1B",
	title : "#222222",
    label: "#8A8A8A",
    borderColor : "#ECECEC",
    input : "rgba(0,0,0,.03)",
	inputborder:"#C1CDD9",
    card : "#fff",
	mainBackground: "#FFFEFE",
	success: "#159E42",
	danger: "#FF3131",
	warning: "#ffb02c",
	dark: "#2f2f2f",
	light: "#E6E6E6",
	info: "#2B39B9",

}



export const SIZES = {
    fontLg: 16,
	font: 14,
	fontSm: 13,
	fontXs: 12,

    //radius
	radius_sm: 8,
	radius: 6,
	radius_lg: 15,

	//space
	padding: 15,
	margin: 15,

    //Font Sizes
	h1: 40,
	h2: 28,
	h3: 24,
	h4: 20,
	h5: 18,
	h6: 16,

	//App dimensions
	width,
	height,

	container: 800,
}



export const FONTS = {
	fontLg: { fontSize: SIZES.fontLg, color: COLORS.text, lineHeight: 20, fontFamily: 'Poppins-Regular'},
	font: { fontSize: SIZES.font, color: COLORS.text, lineHeight: 20, fontFamily: 'Poppins-Regular'},
	fontSm: { fontSize: SIZES.fontSm, color: COLORS.text, lineHeight: 18, fontFamily: 'Poppins-Regular'},
	fontXs: { fontSize: SIZES.fontXs, color: COLORS.text, lineHeight: 14, fontFamily: 'Poppins-Regular'},
	h1: { fontSize: SIZES.h1, color: COLORS.title, fontFamily: 'Poppins-SemiBold'},
	h2: { fontSize: SIZES.h2, color: COLORS.title, fontFamily: 'Poppins-SemiBold'},
	h3: { fontSize: SIZES.h3, color: COLORS.title, fontFamily: 'Poppins-SemiBold'},
	h4: { fontSize: SIZES.h4, color: COLORS.title, fontFamily: 'Poppins-SemiBold'},
	h5: { fontSize: SIZES.h5, color: COLORS.title, fontFamily: 'Poppins-SemiBold'},
	h6: { fontSize: SIZES.h6, color: COLORS.title, fontFamily: 'Poppins-SemiBold'},
	fontRegular: { fontFamily: 'Poppins-Regular'},
	fontMedium: { fontFamily: 'Poppins-Medium'},
	fontTitle: { fontFamily: 'Poppins-Medium'},
	fontBold: { fontFamily: 'Poppins-Bold'},
	fontSemiBold: { fontFamily: 'Poppins-SemiBold'},
	fontLight: { fontFamily: 'Poppins-Light'},
	fontExtraLight: { fontFamily: 'Poppins-ExtraLight'},
	fontExtraBold: { fontFamily: 'Poppins-ExtraBold'},
	fontBlack: { fontFamily: 'Poppins-Black'},

}


const appTheme = {COLORS, SIZES, FONTS}

export default appTheme;