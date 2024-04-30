import {Images} from '@config';
import * as Utils from '@utils';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async ({params}) => {
  await Utils.delay(1000);
  const token = await AsyncStorage.getItem('jwt');

  const user = await axios.get(
    'https://walrus-app-vw6js.ondigitalocean.app/api/users/me',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if(user.data){
    return {
      success: true,
      data: {
        display_name: user.username,
        user_nicename: user.username,
        user_photo: Images.profile2,
        user_url: 'passionui.com',
        user_level: user.cargo,
        description: 'Better and better',
        tag: user.cargo,
        rate: 5,
        token: token,
        user_email: user.email,
        value: [
          {value: '97.01%', title: 'feedback'},
          {value: '999', title: 'items'},
          {value: '120k', title: 'followers'},
        ],
      },
    };
  }
  

  return {
    success: false,
    message: 'confirm_password_not_corrent',
  };
};
