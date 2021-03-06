import React from "react";

const Sidebar: React.FC = () => {

  const asideStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    padding: "20% .75em",
    minHeight: "100vh"
  }

  return (
    <aside 
      className="d-lg-block d-none"
      style={asideStyle}>
      <a rel="noopener" target="_blank" href="https://informationsmodellierung.uni-graz.at/en/">
        <img alt="ZIM Graz logo" width={32} height={25} src="https://static.uni-graz.at/fileadmin/_processed_/1/3/csm_2018-11-22_ZIM_schwarz_typo3_24124f9364.png"></img>
      </a>
      <br/>
      <a rel="noopener" target="_blank" href="https://www.uni-graz.at/en/">
        <img alt="University of Graz logo" style={{border: "1px solid lightgrey"}} width={32} height={25} src="https://static.uni-graz.at/fileadmin/grafik/logos_vorschau/logo_uni_graz_sw_ohne.jpg"></img>
      </a>
      <br/>

    </aside>)

}


export default Sidebar;