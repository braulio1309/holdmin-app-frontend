import React, {useState} from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import {SafeAreaView, Text, Button, Image} from '@components';
import styles from './styles';
import Swiper from 'react-native-swiper';
import {BaseColor, BaseStyle, Images, useTheme} from '@config';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';

export default function Walkthrough({navigation}) {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [slide] = useState([
    {key: 1, image: Images.holminFavicon, text: 'Accede a tu equipo de consultores especializados del área que necesites', title: 'Bienvenido a Holdmin'},
    {key: 2, image: Images.holminFavicon, text: 'Accede y agenda nuestras reuniones a todo nuestro equipo de cada departamento', title: 'El equipo, más cerca que nunca'},
    {key: 3, image: Images.holminFavicon, text: 'Las novedades de marketing, negocios, legal, compliance y mucho más', title: 'Las novedades en tu mano'},
    //{key: 4, image: Images.trip4, text: '', title: ''},
  ]);
  const {colors} = useTheme();
  const {t} = useTranslation();
  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <ScrollView
        contentContainerStyle={styles.contain}
        scrollEnabled={scrollEnabled}
        onContentSizeChange={(contentWidth, contentHeight) =>
          setScrollEnabled(Utils.scrollEnabled(contentWidth, contentHeight))
        }>
        <View style={styles.wrapper}>
          {/* Images Swiper */}
          <Swiper
            dotStyle={{
              backgroundColor: BaseColor.dividerColor,
            }}
            activeDotColor={colors.primary}
            paginationStyle={styles.contentPage}
            removeClippedSubviews={false}>
            {slide.map((item, index) => {
              return (
                
                <View style={styles.slide} key={item.key}>
                  <Image source={Images.holminFavicon} style={styles.img} />
                  <Text body1 style={styles.title}>
                    {item.title}
                  </Text>
                  <Text body1 style={styles.textSlide}>
                    {item.text}
                  </Text>
                </View>
              );
            })}
          </Swiper>
        </View>
        <View style={{width: '100%'}}>
          <Button
            full
            style={{marginTop: 80}}
            onPress={() => navigation.navigate('SignIn')}>
            {t('sign_in')}
          </Button>
          <View style={styles.contentActionBottom}>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text body1 grayColor>
                {t('not_have_account')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
