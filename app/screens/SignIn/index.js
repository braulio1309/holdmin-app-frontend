import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {BaseStyle, useTheme, Images} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  TextInput,
  Image,
} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {authActions} from '@actions';
import {designSelect} from '@selectors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function SignIn({navigation, route}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const design = useSelector(designSelect);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('paul');
  const [password, setPassword] = useState('123456');
  const [success, setSuccess] = useState({id: true, password: true});

  /**
   * call when action onLogin
   */
  const onLogin = async () => {
    if (id == '' || password == '') {
      setSuccess({
        ...success,
        id: false,
        password: false,
      });
      return;
    }
    const params = {
      identifier: id,
      password,
    };
    setLoading(true);
    try {
      const res = await axios.post(
        `https://walrus-app-vw6js.ondigitalocean.app/api/auth/local`,
        {
          identifier: id,
          password: password,
        },
      );
      const {jwt, user} = res.data;
      await AsyncStorage.setItem('jwt', jwt);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      dispatch(
        authActions.onLogin(params, design, response => {
          if (response?.success) {
            navigation.goBack();
            setTimeout(() => {
              route.params?.success?.();
            }, 1000);
            return;
          }
          Alert.alert({title: t('sign_in'), message: t(response?.message)});
          setLoading(false);
        }),
      );
      /*navigation.goBack();
      setTimeout(() => {
        route.params?.success?.();
      }, 1000);
      Alert.alert({title: t('sign_in'), message: 'Inicio de sesión exitoso'});*/
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    /*dispatch(
      authActions.onLogin(params, design, response => {
        if (response?.success) {
          navigation.goBack();
          setTimeout(() => {
            route.params?.success?.();
          }, 1000);
          return;
        }
        Alert.alert({title: t('sign_in'), message: t(response?.message)});
        setLoading(false);
      }),
    );*/
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('sign_in')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          <Image source={Images.holminNegro} style={styles.img} />
          <View style={styles.contain}>
            <TextInput
              onChangeText={setId}
              onFocus={() => {
                setSuccess({
                  ...success,
                  id: true,
                });
              }}
              placeholder={t('input_id')}
              success={success.id}
              value={id}
            />
            <TextInput
              style={{marginTop: 10}}
              onChangeText={setPassword}
              onFocus={() => {
                setSuccess({
                  ...success,
                  password: true,
                });
              }}
              placeholder={t('input_password')}
              secureTextEntry={true}
              success={success.password}
              value={password}
            />
            <Button
              style={{marginTop: 20}}
              full
              loading={loading}
              onPress={onLogin}>
              {t('sign_in')}
            </Button>
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}>
              <Text body1 grayColor style={{marginTop: 25}}>
                {t('forgot_your_password')}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
