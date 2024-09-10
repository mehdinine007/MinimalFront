import { useState } from 'react';
import Footer from '../UI/footer';
import Modal from '../../components/modals/modal';
import Navbar from '../UI/navbar';
import classes from './MainLayout.module.scss';
import { useContext, useEffect } from 'react';
import authContext from '../../context/auth/authContext';

 
const MainLayout = ({ children }) => {
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState(false);
      const {
        GetFooterData,
        footerPageData,
        
      } = useContext(authContext);
      
  useEffect(() => {
    GetFooterData('5');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={classes.main}>
      <Navbar setIsDeleteAccountModalVisible={setIsDeleteAccountModalVisible} />
      {children}
    
      <Footer footerData={footerPageData?.at(0)?.carouselData?.at(0)} />
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
