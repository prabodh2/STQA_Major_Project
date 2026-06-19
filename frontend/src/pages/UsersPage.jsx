import React from 'react'
import Sidebar from '../components/Sidebar';
import { styled } from 'styled-components';
import UserProducts from '../components/UserProductList';

const UsersPage = () => {
  return (
    <DIV>
      <div className='sidebar'>
        <Sidebar/>
      </div>
      <div className='content'>
        <UserProducts/>
      </div>
    </DIV>
  )
}

export default UsersPage;

const DIV = styled.div`
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  gap: 30px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);

  .sidebar {
    flex: 0 0 280px;
    position: sticky;
    top: 20px;
    height: fit-content;
  }

  .content {
    flex: 1;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    
    .sidebar {
      position: static;
      width: 100%;
    }
  }
`;