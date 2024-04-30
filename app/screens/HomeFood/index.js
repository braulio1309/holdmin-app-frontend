import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {BaseStyle, useTheme, BaseColor} from '@config';
import {
  SafeAreaView,
  Icon,
  Text,
  Tag,
  Image,
  FoodListItem,
  ModalFilter,
} from '@components';
import styles from './styles';
import {useSelector, useDispatch} from 'react-redux';
import {homeSelect, wishlistSelect, designSelect} from '@selectors';
import {useTranslation} from 'react-i18next';
import {
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from 'rn-placeholder';
import Swiper from 'react-native-swiper';
import {homeActions} from '@actions';

export default function HomeFood({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const home = useSelector(homeSelect);
  const wishlist = useSelector(wishlistSelect);
  const design = useSelector(designSelect);
  const dispatch = useDispatch();

  const [countrys, setCountry] = useState(null);
  const [countrySelected, setCountrySelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (home.countrys?.length > 0) {
      home.countrys[0].checked = true;
      setCountrySelected(home.countrys[0]);
      setCountry(home.countrys);
    }
  }, [home]);

  /**
   * on Refresh category
   */
  const onRefresh = () => {
    setRefreshing(true);
    dispatch(
      homeActions.onLoad(design, () => {
        setRefreshing(false);
      }),
    );
  };

  /**
   * check wishlist state
   * only UI kit
   */
  const isFavorite = item => {
    return wishlist.list?.some(i => i.id == item.id);
  };

  /**
   * onSelect conntry
   */
  const onChangeCountry = () => {
    setCountrySelected(countrys?.find(item => item.checked));
    setModalVisible(false);
  };

  /**
   * onChange conntry
   */
  const onSelectCountry = selected => {
    setCountry(
      countrys?.map(item => {
        return {
          ...item,
          checked: item.value == selected.value,
        };
      }),
    );
  };

  /**
   *
   * onOpen ChooseBusiness
   */
  const onChooseBusiness = () => {
    navigation.navigate('ChooseBusiness');
  };

  /**
   *
   * onOpen Notification
   */
  const onNotification = () => {
    navigation.navigate('Notification');
  };

  /**
   * on navigate to List
   *
   */
  const onListView = () => {
    navigation.navigate('List');
  };

  /**
   * on navigate to Product detail
   *
   */
  const onProductDetail = item => {
    navigation.navigate('ProductDetail', {
      item: item,
    });
  };

  const renderSlider = () => {
    if (home?.sliders?.length > 0) {
      return (
        <View style={styles.sliderContent}>
          <View style={styles.slider}>
            <Swiper
              dotStyle={{
                backgroundColor: colors.border,
                marginBottom: 8,
              }}
              activeDotStyle={{
                marginBottom: 8,
              }}
              paginationStyle={{bottom: 0}}
              loop={false}
              activeDotColor={colors.primary}
              removeClippedSubviews={false}>
              {home.sliders.map((item, index) => {
                return (
                  <TouchableOpacity
                    style={{flex: 1}}
                    key={`banner${index}`}
                    activeOpacity={1}
                    onPress={() => onProductDetail(item)}>
                    <Image
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 10,
                      }}
                      source={item.image}
                    />
                    <View style={styles.sliderTopLeft}>
                      <Text headline semibold whiteColor>
                        {item.title}
                      </Text>
                      <View style={styles.contentSliderRate}>
                        <View
                          style={[
                            styles.tagRate,
                            {backgroundColor: colors.primaryLight},
                          ]}>
                          <Icon
                            name="star"
                            size={10}
                            color={BaseColor.whiteColor}
                            solid
                          />
                          <Text
                            caption2
                            whiteColor
                            semibold
                            style={{marginLeft: 4}}>
                            {item.rate}
                          </Text>
                        </View>
                        <Text caption2 whiteColor semibold>
                          {item.numberRate} {t('reviews')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </Swiper>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.sliderContent}>
        <Placeholder Animation={Progressive}>
          <PlaceholderMedia style={styles.slider} />
        </Placeholder>
      </View>
    );
  };
  /**
   * render list Location
   */
  const renderCategory = () => {
    let list = (
      <FlatList
        contentContainerStyle={{
          paddingLeft: 10,
          paddingRight: 20,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3, 4, 5, 6]}
        keyExtractor={(item, index) => `Category ${index}`}
        renderItem={({item, index}) => {
          return (
            <View style={{paddingHorizontal: 10}}>
              <Placeholder Animation={Progressive}>
                <View
                  style={[
                    styles.categoryContent,
                    {backgroundColor: colors.card},
                  ]}>
                  <PlaceholderMedia style={styles.imageContent} />
                  <PlaceholderLine
                    style={{width: 50, height: 8, marginTop: 10}}
                  />
                </View>
              </Placeholder>
            </View>
          );
        }}
      />
    );
    if (home?.categories?.length > 0) {
      list = (
        <FlatList
          contentContainerStyle={{
            paddingLeft: 10,
            paddingRight: 20,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={home?.categories}
          keyExtractor={(item, index) => `Category ${index}`}
          renderItem={({item, index}) => {
            return (
              <View style={{paddingHorizontal: 10}}>
                <TouchableOpacity
                  style={[
                    styles.categoryContent,
                    {backgroundColor: colors.card},
                  ]}
                  onPress={onListView}>
                  <Image style={styles.imageContent} source={item.image} />
                  <Text
                    footnote
                    style={{
                      marginTop: 10,
                    }}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      );
    }

    return (
      <View>
        <Text
          title3
          bold
          style={{marginTop: 20, paddingHorizontal: 20, marginBottom: 15}}>
          {t('explore_category')}
        </Text>
        {list}
      </View>
    );
  };

  /**
   * render list Feature
   */
  const renderRecommend = () => {
    let list = (
      <FlatList
        contentContainerStyle={{paddingLeft: 20}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3, 4, 5, 6]}
        keyExtractor={(item, index) => `popular${index}`}
        renderItem={({item, index}) => (
          <FoodListItem
            loading={true}
            grid
            style={{
              marginRight: 15,
              width: 200,
            }}
          />
        )}
      />
    );

    if (home?.recommends?.length > 0) {
      list = (
        <FlatList
          contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={home?.recommends}
          keyExtractor={(item, index) => `popular${index}`}
          renderItem={({item, index}) => (
            <FoodListItem
              grid
              title={item.title}
              subtitle={item.subtitle}
              status={item.status}
              image={item.image}
              address={item.address}
              favorite={isFavorite(item)}
              distance={item.distance}
              promotion={item.promotion}
              style={{
                marginLeft: 15,
                width: 200,
              }}
              onPress={() => onProductDetail(item)}
            />
          )}
        />
      );
    }

    return (
      <View>
        <View style={{padding: 20}}>
          <Text title3 bold>
            {t('recommend_for_buy')}
          </Text>
          <Text body2 grayColor style={{marginTop: 4}}>
            {t('let_find_best_choose')}
          </Text>
        </View>
        {list}
      </View>
    );
  };

  /**
   * render content banner
   * @returns
   */
  const renderBanner = () => {
    let banner = (
      <Placeholder Animation={Progressive}>
        <PlaceholderMedia style={styles.banner} />
      </Placeholder>
    );
    if (home.banner) {
      banner = (
        <View style={styles.banner}>
          <Image
            style={{width: '100%', height: '100%', borderRadius: 10}}
            source={home.banner.image}
          />
          <View style={styles.contentBannerTopLeft}>
            <Text headline semibold whiteColor>
              {home.banner.title}
            </Text>
            <Text footnote medium whiteColor style={{marginTop: 5}}>
              {t('let_find_best_promotion')}
            </Text>
          </View>
          <TouchableOpacity style={styles.bannerButton}>
            <Tag primary onPress={onListView}>
              {t('see_more')}
            </Tag>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={{paddingHorizontal: 20, paddingTop: 20}}>{banner}</View>
    );
  };

  /**
   * render content new event
   * @returns
   */
  const renderRecentLocation = () => {
    let list = (
      <View style={{paddingHorizontal: 20}}>
        {[1, 2, 3, 4, 5].map((item, index) => {
          return (
            <FoodListItem
              key={`RecentLocation ${index}`}
              loading={true}
              list
              style={{marginBottom: 15}}
            />
          );
        })}
      </View>
    );

    if (home.locations?.length > 0) {
      list = (
        <View style={{paddingHorizontal: 20}}>
          {home.locations.map((item, index) => {
            return (
              <FoodListItem
                key={`RecentLocation ${index}`}
                list
                title={item.title}
                subtitle={item.subtitle}
                status={item.status}
                image={item.image}
                address={item.address}
                favorite={isFavorite(item)}
                style={{marginBottom: 15}}
                onPress={() => onProductDetail(item)}
              />
            );
          })}
        </View>
      );
    }

    return (
      <View>
        <View style={{padding: 20}}>
          <Text title3 bold>
            {t('recent_location')}
          </Text>
          <Text
            body2
            grayColor
            style={{
              marginTop: 4,
            }}>
            {t('best_place_tasty')}
          </Text>
        </View>
        {list}
      </View>
    );
  };

  /**
   * render content screen
   * @returns
   */
  const renderContent = () => {
    let countryView = <ActivityIndicator size="small" color={colors.primary} />;
    if (countrys?.length > 0) {
      countryView = (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <ModalFilter
            options={countrys}
            isVisible={modalVisible}
            onSwipeComplete={() => {
              setModalVisible(false);
            }}
            onApply={onChangeCountry}
            onSelectFilter={onSelectCountry}
          />
          <Icon name="map-marker-alt" size={18} color={colors.text} solid />
          <Text headline semibold style={{paddingHorizontal: 4}}>
            {countrySelected.text}
          </Text>
          <Icon
            name="chevron-down"
            size={12}
            color={colors.primaryLight}
            solid
          />
        </TouchableOpacity>
      );
    }

    return (
      <View style={{flex: 1}}>
        <View style={styles.contentHeader}>
          {countryView}
          <TouchableOpacity
            style={styles.notificationContent}
            onPress={() => onNotification()}>
            <Icon name="bell" size={18} color={BaseColor.grayColor} solid />
            <View
              style={[
                styles.doc,
                {
                  backgroundColor: colors.primaryLight,
                  borderColor: colors.card,
                },
              ]}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('SearchHistory')}
          style={styles.contentSearch}>
          <View style={[BaseStyle.textInput, {backgroundColor: colors.card}]}>
            <Text body1 grayColor style={{flex: 1}}>
              {t('search_food')}
            </Text>
            <View style={{paddingVertical: 8}}>
              <View
                style={[styles.lineForm, {backgroundColor: colors.border}]}
              />
            </View>
            <Icon
              name="location-arrow"
              size={18}
              color={colors.primaryLight}
              solid
            />
          </View>
        </TouchableOpacity>
        <ScrollView
          style={{flex: 1}}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }>
          {renderSlider()}
          {renderCategory()}
          {renderRecommend()}
          {renderBanner()}
          {renderRecentLocation()}
        </ScrollView>
        <TouchableOpacity
          onPress={onChooseBusiness}
          style={[styles.menuIcon, {backgroundColor: colors.primary}]}>
          <Icon name="plus" size={16} color={BaseColor.whiteColor} solid />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      {renderContent()}
    </SafeAreaView>
  );
}
