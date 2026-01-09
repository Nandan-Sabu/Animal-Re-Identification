/** @format */

import PropTypes from "prop-types";
import NavBar from "./Navbar";
import "./PageLayout.css";

export default function SitePage({ component }) {
  return (
    <div className="layout-format">
      <NavBar />
      <div className="main-content">
        {component}
      </div>
    </div>
  );
}

SitePage.propTypes = {
  component: PropTypes.node,
}
