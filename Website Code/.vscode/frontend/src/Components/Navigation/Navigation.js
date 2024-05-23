import React from "react";
import styled from "styled-components";
import { menuItems } from "../../utils/menuItems";

function Navigation({ active, setActive, username }) {
  return (
    <NavStyled>
      <ul className="menu-items">
        {menuItems.map((item) => {
          return (
            <li
              key={item.id}
              onClick={() => setActive(item.id)}
              className={active === item.id ? "active" : ""}
            >
              {item.icon}
              <span>{item.title}</span>
            </li>
          );
        })}
      </ul>
    </NavStyled>
  );
}

const NavStyled = styled.nav`
  padding: 2rem 1.5rem;
  width: 374px;
  height: 100%;
  background: rgba(252, 246, 249, 0.78);
  border: 3px solid #ffffff;
  backdrop-filter: blur(4.5px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #ffffff;

  .user-con {
    height: 100px;
    display: flex;
    align-items: center;
    gap: 1rem;
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      background: #fcf6f9;
      border: 2px solid #ffffff;
      padding: 0.2rem;
      box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
    }
    h2 {
      color: rgba(34, 34, 96, 1);
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }
    p {
      color: rgba(34, 34, 96, 0.6);
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }
    div {
      display: flex;
      flex-direction: column;
      small {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }
      p {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: #454545;
      }
    }
  }

  .menu-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    li {
      display: grid;
      grid-template-columns: 40px auto;
      align-items: center;
      margin: 0.6rem 0;
      font-weight: normal; /* Default font weight */
      cursor: pointer;
      transition: all 0.4s ease-in-out;
      color: rgba(34, 34, 96, 0.6);
      padding-left: 1rem;
      position: relative;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      i {
        color: rgba(34, 34, 96, 0.6);
        font-size: 1.4rem;
        transition: all 0.4s ease-in-out;
      }
      span {
        font-weight: normal; /* Ensure the text inside span is normal */
      }
    }
  }

  .active {
    font-weight: bold;
    color: rgba(34, 34, 96, 1) !important;
    i {
      color: rgba(34, 34, 96, 1) !important;
    }
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background: #222260;
      border-radius: 0 10px 10px 0;
    }
    span {
      font-weight: bold !important; /* Ensure the text inside span is bold when active */
    }
  }

  .bottom-nav {
    li {
      display: flex;
      align-items: center;
      color: rgba(34, 34, 96, 0.6);
      cursor: pointer;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      font-size: 1.2rem; 
    }
  }
`;

export default Navigation;
