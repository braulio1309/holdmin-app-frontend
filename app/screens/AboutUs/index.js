import React, {useState} from 'react';
import {View, ScrollView, ImageBackground, FlatList, Linking, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {BaseStyle, Images, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Card,
  ProfileDescription,
} from '@components';
import styles from './styles';

export default function AboutUs({navigation, route}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const item = JSON.parse(route.params?.item);
  console.log('ajaaa',item)
  const [ourTeam] = useState([
    {
      id: '1',
      screen: 'Profile1',
      image: Images.profile2,
      subName: 'CEO Founder',
      name: 'Kondo Ieyasu',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
    {
      id: '2',
      screen: 'Profile2',
      image: Images.profile3,
      subName: 'Sale Manager',
      name: 'Yeray Rosales',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
    {
      id: '3',
      screen: 'Profile3',
      image: Images.profile5,
      subName: 'Product Manager',
      name: 'Alf Huncoot',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
    {
      id: '4',
      screen: 'Profile4',
      image: Images.profile4,
      subName: 'Designer UI/UX',
      name: 'Chioke Okonkwo',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
  ]);

  const renderContent = (content) => {
    return content.map((item, index) => {
      switch (item.type) {
        case 'paragraph':
          return (
            <Text key={index} style={getStyleForText(item.children)}>
              {renderTextNodes(item.children)}
            </Text>
          );
        case 'list':
          return (
            <View key={index} style={{ marginLeft: 20 }}>
              {renderList(item.children)}
            </View>
          );
        case 'heading':
          return (
            <Text key={index} style={{ fontSize: getFontSizeForHeading(item.level) }}>
              {renderTextNodes(item.children)}
            </Text>
          );
        default:
          return null;
      }
    });
  };
  
  const renderTextNodes = (children) => {
    return children.map((child, index) => {
      switch (child.type) {
        case 'text':
          if(child.text == '')
            return  '\n'
          return child.text;
        case 'link':
          return (
            <TouchableOpacity key={index} style={{ color: 'blue' }} onPress={() => handleLinkPress(child.url)}>
                <View><Text style={{ color: 'blue' }}>{child.children[0].text}</Text></View>
            </TouchableOpacity>
          );
        default:
          return null;
      }
    });
  };
  
  
  
  const renderList = (listItems) => {
    return listItems.map((item, index) => {
      return (
        <Text key={index} style={getStyleForText(item.children[0])}>
          {item.children[0].text}
        </Text>
      );
    });
  };
  
  const getStyleForText = (textNode) => {
    let style = {};
    if (textNode.bold) style.fontWeight = 'bold';
    if (textNode.italic) style.fontStyle = 'italic';
    if (textNode.underline) style.textDecorationLine = 'underline';
    if (textNode.strikethrough) style.textDecorationLine = 'line-through';
    return style;
  };

  const handleLinkPress = (url) => {
    console.log(url)
    Linking.openURL(url);
  };
  
  const getFontSizeForHeading = (level) => {
    switch (level) {
      case 1:
        return 32;
      case 2:
        return 28;
      case 3:
        return 24;
      case 4:
        return 20;
      default:
        return 16;
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('about_us')}
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
        <ScrollView style={{flex: 1}}>
          <ImageBackground source={Images.trip4} style={styles.banner}>
            <Text title1 semibold whiteColor>
              {item.attributes.title}
            </Text>
            <Text subhead whiteColor>
              {t('sologan_about_us')}
            </Text>
          </ImageBackground>
          <View style={styles.content}>
            <Text headline semibold>
              {item.attributes.title.toUpperCase()}
            </Text>
            <Text body2 style={{marginTop: 5}}>
            {renderContent(item.attributes.content)}
            </Text>
          </View>
          <Text headline semibold style={styles.title}>
            {t('meet_our_team').toUpperCase()}
          </Text>
          {/*<FlatList
            contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
            numColumns={2}
            data={ourTeam}
            keyExtractor={(item, index) => 'ourTeam' + index}
            renderItem={({item, index}) => (
              <Card
                image={item.image}
                onPress={() => navigation.navigate(item.screen)}
                style={{
                  flex: 1,
                  marginLeft: 15,
                  height: 200,
                  marginBottom: 20,
                }}>
                <Text footnote whiteColor>
                  {item.subName}
                </Text>
                <Text headline whiteColor semibold numberOfLines={1}>
                  {item.name}
                </Text>
              </Card>
            )}
          />*/}
          
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
