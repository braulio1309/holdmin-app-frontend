import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import {BaseColor, useTheme, BaseStyle} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  Tag,
  Image,
  ListItem,
} from '@components';
import {useTranslation} from 'react-i18next';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import * as Utils from '@utils';
import {useDispatch, useSelector} from 'react-redux';
import {
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from 'rn-placeholder';
import {productActions, wishListActions} from '@actions';
import {userSelect, wishlistSelect, designSelect} from '@selectors';
import styles from './styles';
import axios from 'axios';

export default function ProductDetail({navigation, route}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const wishlist = useSelector(wishlistSelect);
  const design = useSelector(designSelect);
  const item = route.params?.item;
  const user = useSelector(userSelect);
  const deltaY = new Animated.Value(0);

  const [loading, setLoading] = useState(true);
  const [like, setLike] = useState(null);
  const [product, setProduct] = useState(null);
  const [employee, setUser] = useState(null);
  const [collapseHour, setCollapseHour] = useState(false);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(250, 1);

  useEffect(() => {
    dispatch(
      productActions.onLoadProduct(item.id, design, item => {
        setLoading(false);
        setProduct(item);
        setLike(item.favorite);
      }),
      axios
        .get(`https://walrus-app-vw6js.ondigitalocean.app/api/users/${item.id}?populate=foto`)
        .then(response => {
          console.log('detalle', response.data)
          setUser(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.log('error', error.stack);
        })

    );
  }, [design, dispatch, item.id]);

  /**
   * check wishlist state
   * only UI kit
   */
  const isFavorite = item => {
    return wishlist.list?.some(i => i.id === item.id);
  };

  /**
   * like action
   * @param {*} like
   */
  const onLike = like => {
    if (user) {
      setLike(null);
      dispatch(wishListActions.onUpdate(item));
      setLike(like);
    } else {
      navigation.navigate({
        name: 'SignIn',
        params: {
          success: () => {
            dispatch(wishListActions.onUpdate(item));
            setLike(like);
          },
        },
      });
    }
  };

  /**
   * on Review action
   */
  const onReview = () => {
    if (user) {
      navigation.navigate({
        name: 'Review',
      });
    } else {
      navigation.navigate({
        name: 'SignIn',
        params: {
          success: () => {
            navigation.navigate({
              name: 'Review',
            });
          },
        },
      });
    }
  };

  /**
   * go product detail
   * @param {*} item
   */
  const onProductDetail = item => {
    navigation.replace('ProductDetail', {item: item});
  };

  /**
   * Open action
   * @param {*} item
   */
  const onOpen = (type, title, link) => {
    Alert.alert({
      title: title,
      message: `${t('do_you_want_open')} ${title} ?`,
      action: [
        {
          text: t('cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: t('done'),
          onPress: () => {
            switch (type) {
              case 'web':
                Linking.openURL(link);
                break;
              case 'phone':
                Linking.openURL('tel://' + link);
                break;
              case 'email':
                Linking.openURL('mailto:' + link);
                break;
              case 'address':
                Linking.openURL(link);
                break;
            }
          },
        },
      ],
    });
  };

  /**
   * collapse open time
   */
  const onCollapse = () => {
    Utils.enableExperimental();
    setCollapseHour(!collapseHour);
  };

  /**
   * render wishlist status
   *
   */
  const renderLike = () => {
    return (
      <TouchableOpacity onPress={() => onLike(!like)}>
        {like ? (
          <Icon name="heart" color={colors.primaryLight} solid size={18} />
        ) : (
          <Icon name="heart" color={colors.primaryLight} size={18} />
        )}
      </TouchableOpacity>
    );
  };
  /**
   * render Banner
   * @returns
   */
  const renderBanner = () => {
    if (loading) {
      return (
        <Placeholder Animation={Progressive}>
          <Animated.View
            style={[
              styles.imgBanner,
              {
                height: deltaY.interpolate({
                  inputRange: [
                    0,
                    Utils.scaleWithPixel(140),
                    Utils.scaleWithPixel(140),
                  ],
                  outputRange: [heightImageBanner, heightHeader, heightHeader],
                }),
              },
            ]}>
            <PlaceholderMedia style={{width: '100%', height: '100%'}} />
          </Animated.View>
        </Placeholder>
      );
    }

    return (
      <Animated.View
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}>
        <Image
          source={product?.image?.full}
          style={{width: '100%', height: '100%'}}
        />
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 15,
            left: 20,
            flexDirection: 'row',
            opacity: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              outputRange: [1, 0, 0],
            }),
          }}>
          <Image source={product?.author?.image} style={styles.userIcon} />
          <View>
            <Text headline semibold whiteColor>
              {product?.author?.name}
            </Text>
            <Text footnote whiteColor>
              {product?.author?.email}
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  /**
   * render Content View
   * @returns
   */
  const renderContent = () => {
    if (loading) {
      return (
        <ScrollView
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {y: deltaY},
                },
              },
            ],
            {useNativeDriver: false},
          )}
          onContentSizeChange={() => {
            setHeightHeader(Utils.heightHeader());
          }}
          scrollEventThrottle={8}>
          <View style={{height: 255 - heightHeader}} />
          <Placeholder Animation={Progressive}>
            <View
              style={{
                paddingHorizontal: 20,
                marginBottom: 20,
              }}>
              <PlaceholderLine style={{width: '50%', marginTop: 10}} />
              <PlaceholderLine style={{width: '70%'}} />
              <PlaceholderLine style={{width: '40%'}} />
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{marginLeft: 10, flex: 1, paddingTop: 10}}>
                  <PlaceholderLine style={{width: '40%'}} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{marginLeft: 10, flex: 1, paddingTop: 10}}>
                  <PlaceholderLine style={{width: '40%'}} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{marginLeft: 10, flex: 1, paddingTop: 10}}>
                  <PlaceholderLine style={{width: '40%'}} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{marginLeft: 10, flex: 1, paddingTop: 10}}>
                  <PlaceholderLine style={{width: '40%'}} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{marginLeft: 10, flex: 1, paddingTop: 10}}>
                  <PlaceholderLine style={{width: '40%'}} />
                </View>
              </View>
              <PlaceholderLine
                style={{width: '100%', height: 250, marginTop: 20}}
              />
            </View>
          </Placeholder>
        </ScrollView>
      );
    }
    return (
      <ScrollView
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ],
          {useNativeDriver: false},
        )}
        onContentSizeChange={() => {
          setHeightHeader(Utils.heightHeader());
        }}
        scrollEventThrottle={8}>
        <View style={{height: 255 - heightHeader}} />
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 20,
          }}>
          <View style={styles.lineSpace}>
            <Text title1 semibold style={{paddingRight: 15}}>
              {employee?.username}
            </Text>
            {renderLike()}
          </View>
          <View style={styles.lineSpace}>
            <View>
              <Text caption1 grayColor>
                {employee?.presentacion}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              const location = `${product?.location?.latitude},${product?.location?.longitude}`;
              const url = Platform.select({
                ios: `maps:${location}`,
                android: `geo:${location}?center=${location}&q=${location}&z=16`,
              });
              onOpen('address', t('address'), url);
            }}>
            <View
              style={[styles.contentIcon, {backgroundColor: colors.border}]}>
              <Icon
                name="map-marker-alt"
                size={16}
                color={BaseColor.whiteColor}
              />
            </View>
            <View style={{marginLeft: 10}}>
              <Text caption2 grayColor>
                {t('address')}
              </Text>
              <Text footnote semibold style={{marginTop: 5}}>
                {employee?.presentation}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              onOpen('phone', t('tel'), employee?.telefono);
            }}>
            <View
              style={[styles.contentIcon, {backgroundColor: colors.border}]}>
              <Icon name="mobile-alt" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{marginLeft: 10}}>
              <Text caption2 grayColor>
                {t('tel')}
              </Text>
              <Text footnote semibold style={{marginTop: 5}}>
                {employee?.telefono}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              onOpen('web', t('website'), employee?.link_llamada);
            }}>
            <View
              style={[styles.contentIcon, {backgroundColor: colors.border}]}>
              <Icon name="mobile-alt" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{marginLeft: 10}}>
              <Text caption2 grayColor>
                {t('website')}
              </Text>
              <Text footnote semibold style={{marginTop: 5}}>
                Agendar una llamada
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              onOpen('web', t('website'), employee?.link_reunion);
            }}>
            <View
              style={[styles.contentIcon, {backgroundColor: colors.border}]}>
              <Icon name="mobile-alt" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{marginLeft: 10}}>
              <Text caption2 grayColor>
                {t('website')}
              </Text>
              <Text footnote semibold style={{marginTop: 5}}>
                Agendar una reunión
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              onOpen('envelope', t('envelope'), employee?.email);
            }}>
            <View
              style={[styles.contentIcon, {backgroundColor: colors.border}]}>
              <Icon name="envelope" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{marginLeft: 10}}>
              <Text caption2 grayColor>
                {t('email')}
              </Text>
              <Text footnote semibold style={{marginTop: 5}}>
                {employee?.email}
              </Text>
            </View>
          </TouchableOpacity>
         
          <View
            style={{
              paddingLeft: 40,
              paddingRight: 20,
              marginTop: 5,
              height: collapseHour ? 0 : null,
              overflow: 'hidden',
            }}>
            {product?.openTime?.map?.(item => {
              return (
                <View
                  style={[styles.lineWorkHours, {borderColor: colors.border}]}
                  key={item.label}>
                  <Text body2 grayColor>
                    {t(item.label)}
                  </Text>
                  <Text body2 accentColor semibold>
                    {`${item.start} - ${item.end}`}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={{flex: 1}}>
      {renderBanner()}
      <Header
        title=""
        renderLeft={() => {
          return (
            <Icon name="arrow-left" size={20} color={BaseColor.whiteColor} />
          );
        }}
        renderRight={() => {
          return <Icon name="images" size={20} color={BaseColor.whiteColor} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          navigation.navigate('PreviewImage', {
            gallery: product?.gallery,
          });
        }}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
