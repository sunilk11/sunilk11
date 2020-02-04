class Keypad extends React.Component {
  constructor(props) {
    super(props);
  }
  buttonClick(e) {
    this.props.clickHandle(e);
  }
  render() {
    return (
      React.createElement("button", { id: this.props.type, onClick: this.buttonClick.bind(this) }, this.props.buttonKey));

  }}


class Screen extends React.Component {
  constructor() {
    super();
  }
  displayNumber2() {
    let number2 = this.props.num2;
    if (number2 !== 0) {
      return number2;
    }
  }
  render() {
    return (
      React.createElement("div", { id: "Screen" },
      React.createElement("p", null, this.props.input),
      React.createElement("p", { className: "text-small" }, React.createElement("span", null, this.displayNumber2()), React.createElement("span", null, this.props.mode))));


  }}


class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      number: "0", // number to display on top part of screen
      mode: '', // math task (add, substract etc)
      finished: false, // when finished, clear display screen
      math: "",
      dot: false };

  }

  //cleaning display screen
  displayClear() {// reseting state to default state
    this.setState({
      number: "0",
      mode: '',
      finished: false,
      changingMode: false,
      math: "",
      dot: false });

  }

  // Displaying numbers on screen
  buttonClick(e) {
    let pressedButton = e.target.innerHTML;
    if (!this.state.finished) {
      if (this.state.number == "0") {
        this.setState({
          number: pressedButton });

      } else {
        let number = this.state.number + pressedButton;
        this.setState({
          number });

      }
    } else
    this.setState({
      number: pressedButton,
      finished: false });

  }

  //calculating final number and returning it
  calcResult() {
    let math = this.state.math; //get the whole math string, to use eval
    math = math.replace(/÷/i, "/"); // replace unsupported symbol with proper one
    if (this.state.number !== 0) math += this.state.number; // if number is not 0, add number to that string(in case someone will leave math symbol last)
    else math = math.substring(0, math.length - 1); //otherwise, delete that last symbol
    return eval(math); //return finished math
  }

  mathMode(e) {// picking up math mode + displaying current numbers
    let mode = e.target.innerHTML; //picking math option
    let number = this.state.number; // current number
    let math = this.state.math; // current state of our mathematic formula

    if (number == "0") {// if displaying number is 0, we can change math symbols
      if (math[math.length - 1] !== mode) {// check if different symbol was pressed, if yes, swap it
        math = math.substring(0, math.length - 1) + mode; // < in here
      }
      this.setState({ //save current mode and math formula
        mode: "",
        math //math: math
      });
    } else {//if we press math symbol when we have already pressed number, treat it as adding new piece of a math chain, so add it
      this.setState({
        math: math + number + mode, // if we clicked another number, save formula and reset number and mode
        number: "0",
        mode: "" });

    }
  }

  dotButtonClick() {
    if (this.state.number.indexOf(".") == -1) {
      let number = this.state.number.toString();
      number += ".";
      this.setState({
        dot: true,
        number: number });

    }
  }

  mathResult() {
    let number = this.calcResult(); // getting final results
    if (this.state.mode == "") {
      this.setState({ //displaying it
        math: "",
        number,
        finished: true,
        mode: "",
        dot: false });

    }
  }

  render() {
    return (
      React.createElement("div", { className: "center-block", id: "Main" },
      React.createElement("h1", null, "React Calculator"),
      React.createElement(Screen, { input: this.state.number, num2: this.state.math, mode: this.state.mode }),
      React.createElement(Keypad, { type: "clear", clickHandle: this.displayClear.bind(this), buttonKey: 'Clear' }),

      ['+', '-', '÷', '*'].map((val, i) => {
        return React.createElement(Keypad, { type: 'math', clickHandle: this.mathMode.bind(this), key: i * 3, buttonKey: val });
      }),

      React.createElement("div", { id: "Keypad" },

      [1, 2, 3, 4, 5, 6, 7, 8, 9].map((val, i) => {
        return React.createElement(Keypad, { clickHandle: this.buttonClick.bind(this), key: i, buttonKey: val });
      }),

      React.createElement(Keypad, { clickHandle: this.buttonClick.bind(this), buttonKey: 0 }),
      React.createElement(Keypad, { clickHandle: this.dotButtonClick.bind(this), buttonKey: "." }),
      React.createElement(Keypad, { type: "result", clickHandle: this.mathResult.bind(this), buttonKey: '=' }))));



  }}


ReactDOM.render(React.createElement(Main, null), document.getElementById('app'));