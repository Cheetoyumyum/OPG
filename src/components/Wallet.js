import React, { Component } from "react";
import { FaWallet } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBalance: true,
    };
  }

  toggleBalance = () => {
    this.setState({ showBalance: !this.state.showBalance });
  };

  render() {
    const { balance = 1200.35, currency = "M" } = this.props;
    const { showBalance } = this.state;

    return (
      <div className="wallet-container">
        <span className="wallet-symbol">$</span>
        {showBalance ? (
          <span className="wallet-balance">{balance} {currency}</span>
        ) : (
          <span className="wallet-balance">*****</span>
        )}
        <button className="wallet-toggle" onClick={this.toggleBalance}>
          <MdKeyboardArrowDown />
        </button>
      </div>
    );
  }
}

export default Wallet;
