import {Images} from '@config';
import * as Utils from '@utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const user = async ({params}) => {
  await Utils.delay(1000);
  const user = JSON.parse(await AsyncStorage.getItem('userData'));
  return {
    success: true,
    data: {
      display_name: user.username,
      user_nicename: user.username,
      user_photo: Images.profile2,
      user_url: 'passionui.com',
      user_level: user.cargo,
      description: user.cargo,
      tag: 'passionui',
      rate: 5,
      token: await AsyncStorage.getItem('jwt'),
      user_email: user.email,
      value: [
        {value: '97.01%', title: 'feedback'},
        {value: '999', title: 'items'},
        {value: '120k', title: 'followers'},
      ],
    },
  };
};
