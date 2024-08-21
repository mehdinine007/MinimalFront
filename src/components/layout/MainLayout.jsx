import { useState } from 'react';
import Footer from '../UI/footer';
import Modal from '../../components/modals/modal';
import Navbar from '../UI/navbar';
import classes from './MainLayout.module.scss';

const MainLayout = ({ children }) => {
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState(false);

  return (
    <div className={classes.main}>
      <Navbar setIsDeleteAccountModalVisible={setIsDeleteAccountModalVisible} />
      {children}
      <Footer />
      {isDeleteAccountModalVisible && (
        <Modal
          setIsModalVisible={setIsDeleteAccountModalVisible}
          title='انصراف از طرح'
        ></Modal>
      )}
    </div>
  );
};

export default MainLayout;
