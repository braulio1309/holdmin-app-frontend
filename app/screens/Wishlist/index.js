import React, {useState, useEffect} from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, ListItem, Text, Icon} from '@components';
import {wishlistSelect} from '@selectors';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {wishListActions} from '@actions';
import * as Sharing from 'expo-sharing';
import Modal from 'react-native-modal';
import styles from './styles';
import axios from 'axios';

export default function Wishlist({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const wishlist = useSelector(wishlistSelect);
  const [modalVisible, setModalVisible] = useState(false);

  const [refreshing, setRefresh] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionItem, setActionItem] = useState(null);
  const [users, setUsers] = useState([]);


  useEffect(() => {
      axios
        .get(`https://walrus-app-vw6js.ondigitalocean.app/api/users?populate=foto`)
        .then(response => {
          setUsers(response.data);
          setRefresh(false);

        })
        .catch(error => {
          console.log('error', error.stack);
        })

  });

  /**
   * Reload wishlist
   */
  const onRefresh = () => {
      axios
        .get(`https://walrus-app-vw6js.ondigitalocean.app/api/users`)
        .then(response => {
          setUsers(response.data);
          setRefresh(false);

        })
        .catch(error => {
          console.log('error', error.stack);
        })
  
  };

  /**
   * Action Delete/Reset
   */
  const onDelete = item => {
    setDeleting(true);
    setTimeout(() => {
      dispatch(wishListActions.onDelete(item));
      setDeleting(false);
    }, 1000);
  };

  /**
   * Action for share
   */
  const onShare = async item => {
    try {
      await Sharing.shareAsync(item.link);
    } catch (error) {}
    setModalVisible(false);
  };

  /**
   * render UI Modal action
   * @returns
   */
  const renderModal = () => {
    return (
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
          setActionItem(null);
        }}
        swipeDirection={['down']}
        style={styles.bottomModal}>
        <SafeAreaView
          style={[styles.contentFilterBottom, {backgroundColor: colors.card}]}>
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => {
              setModalVisible(false);
              setActionItem(null);
            }}>
            <Icon name="times" size={12} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onShare(actionItem);
            }}
            style={[
              styles.contentActionModalBottom,
              {borderBottomColor: colors.border, borderBottomWidth: 1},
            ]}>
            <Icon name="share" size={18} color={colors.text} />
            <Text body2 semibold style={{marginLeft: 15}}>
              {t('share')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contentActionModalBottom]}
            onPress={() => {
              setModalVisible(false);
              onDelete(actionItem);
            }}>
            <Icon name="trash-alt" size={18} color={colors.text} />
            <Text body2 semibold style={{marginLeft: 15}}>
              {t('remove')}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  };

  /**
   * render content wishlist
   * @returns
   */
  const renderContent = () => {
    if (users.length > 0) {
      return (
        <FlatList
          contentContainerStyle={{paddingTop: 15}}
          style={styles.contentList}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          data={users}
          keyExtractor={(item, index) => `wishlist ${index}`}
          renderItem={({item, index}) => (
            <ListItem
              small
              enableAction={true}
              //image={item.foto}
              title={item.username}
              subtitle={item.email}
              rate={item.rate}
              style={{marginBottom: 15}}
              onPress={() =>
                navigation.navigate('ProductDetail', {
                  item: item,
                })
              }
              omPressMore={() => {
                setActionItem(item);
                setModalVisible(true);
              }}
            />
          )}
        />
      );
    }
    if (wishlist.list?.length == 0) {
      return (
        <View style={styles.loadingContent}>
          <View style={{alignItems: 'center'}}>
            <Icon
              name="frown-open"
              size={18}
              color={colors.text}
              style={{marginBottom: 4}}
            />
            <Text>{t('data_not_found')}</Text>
          </View>
        </View>
      );
    }

    return (
      <FlatList
        contentContainerStyle={{paddingTop: 15}}
        style={styles.contentList}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={[1, 2, 3, 4, 5, 6, 7, 8]}
        keyExtractor={(item, index) => `empty ${index}`}
        renderItem={({item, index}) => (
          <ListItem small loading={true} style={{marginBottom: 15}} />
        )}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('wishlist')}
        renderRight={() => {
          if (deleting) {
            return <ActivityIndicator size="small" color={colors.primary} />;
          }
          return <Icon name="trash-alt" size={16} color={colors.text} />;
        }}
        onPressRight={() => onDelete()}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        {renderModal()}
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
