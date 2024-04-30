import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BaseColor, useTheme, useFont} from '@config';
import {useTranslation} from 'react-i18next';
import {Icon} from '@components';
import {userSelect, designSelect} from '@selectors';
import {useSelector} from 'react-redux';

/* Bottom Screen */
import Home from '@screens/Home';
import HomeRealEstate from '@screens/HomeRealEstate';
import HomeEvent from '@screens/HomeEvent';
import HomeFood from '@screens/HomeFood';
import Wishlist from '@screens/Wishlist';
import WishlistRealEstate from '@screens/WishlistRealEstate';
import WishlistEvent from '@screens/WishlistEvent';
import WishlistFood from '@screens/WishlistFood';
import Profile from '@screens/Profile';
import Messenger from '@screens/Messenger';

/* Stack Screen */
import ThemeSetting from '@screens/ThemeSetting';
import Setting from '@screens/Setting';
import Category from '@screens/Category';
import List from '@screens/List';
import ListRealEstate from '@screens/ListRealEstate';
import ListEvent from '@screens/ListEvent';
import ListFood from '@screens/ListFood';
import Review from '@screens/Review';
import Feedback from '@screens/Feedback';
import Walkthrough from '@screens/Walkthrough';
import ChangePassword from '@screens/ChangePassword';
import ProfileEdit from '@screens/ProfileEdit';
import ChangeLanguage from '@screens/ChangeLanguage';
import ProductDetail from '@screens/ProductDetail';
import ProductDetailRealEsate from '@screens/ProductDetailRealEsate';
import ProductDetailEvent from '@screens/ProductDetailEvent';
import ProductDetailFood from '@screens/ProductDetailFood';
import ContactUs from '@screens/ContactUs';
import Messages from '@screens/Messages';
import AboutUs from '@screens/AboutUs';

const MainStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

export default function Main() {
  const design = useSelector(designSelect);
  /**
   * Main follow return  Product detail design you are selected
   * @param {*} value  ['basic', 'real_estate','event', 'food']
   * @returns
   */
  const exportProductDetail = value => {
    switch (value) {
      case 'real_estate':
        return ProductDetailRealEsate;
      case 'event':
        return ProductDetailEvent;
      case 'food':
        return ProductDetailFood;
      default:
        return ProductDetail;
    }
  };

  /**
   * Main follow return  Product detail design you are selected
   * @param {*} value  ['basic', 'real_estate','event', 'food']
   * @returns
   */
  const exportList = value => {
    switch (value) {
      case 'real_estate':
        return ListRealEstate;
      case 'event':
        return ListEvent;
      case 'food':
        return ListFood;
      default:
        return List;
    }
  };

  const exportContact = value => {
    switch (value) {
      case 'real_estate':
        return ContactUs;
      case 'event':
        return ContactUs;
      case 'food':
        return ContactUs;
      default:
        return ContactUs;
    }
  };

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="BottomTabNavigator">
      <MainStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
      <MainStack.Screen name="ThemeSetting" component={ThemeSetting} />
      <MainStack.Screen name="Setting" component={Setting} />
      <MainStack.Screen name="Category" component={Category} />
      <MainStack.Screen name="List" component={exportList(design)} />
      <MainStack.Screen name="Walkthrough" component={Walkthrough} />
      <MainStack.Screen name="Review" component={Review} />
      <MainStack.Screen name="Feedback" component={Feedback} />
      <MainStack.Screen name="ChangePassword" component={ChangePassword} />
      <MainStack.Screen name="ProfileEdit" component={ProfileEdit} />
      <MainStack.Screen name="ChangeLanguage" component={ChangeLanguage} />
      <MainStack.Screen
        name="ProductDetail"
        component={exportProductDetail(design)}
      />
      <MainStack.Screen name="ContactUs" component={ContactUs} />
      <MainStack.Screen name="AboutUs" component={AboutUs} />
      <MainStack.Screen name="Messages" component={Messages} />
    </MainStack.Navigator>
  );
}

function BottomTabNavigator() {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const font = useFont();
  const user = useSelector(userSelect);
  const design = useSelector(designSelect);

  /**
   * Main follow return  Home Screen design you are selected
   * @param {*} value  ['basic', 'real_estate','event', 'food']
   * @returns
   */
  const exportHome = value => {
    switch (value) {
      case 'real_estate':
        return HomeRealEstate;
      case 'event':
        return HomeEvent;
      case 'food':
        return HomeFood;
      default:
        return Home;
    }
  };

  /**
   * Main follow return  WishList Screen design you are selected
   * @param {*} value  ['basic', 'real_estate','event', 'food']
   * @returns
   */
  const exportWishlist = value => {
    if (!user) {
      return Walkthrough;
    }
    switch (value) {
      case 'real_estate':
        return WishlistRealEstate;
      case 'event':
        return WishlistEvent;
      case 'food':
        return WishlistFood;
      default:
        return Wishlist;
    }
  };

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarInactiveTintColor: BaseColor.grayColor,
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: font,
          paddingBottom: 2,
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={exportHome(design)}
        options={{
          title: t('today'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="home" size={20} solid />;
          },
        }}
      />

      <BottomTab.Screen
        name="Wishlist"
        component={exportWishlist(design)}
        options={{
          title: t('news'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="bookmark" size={20} solid />;
          },
        }}
      />

      <BottomTab.Screen
        name="ContactUs"
        component={ContactUs}
        options={{
          title: t('Contact'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="bookmark" size={20} solid />;
          },
        }}
      />

      <BottomTab.Screen
        name="Profile"
        component={user ? Profile : Walkthrough}
        options={{
          title: t('account'),
          tabBarIcon: ({color}) => {
            return <Icon solid color={color} name="user-circle" size={20} />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
}
