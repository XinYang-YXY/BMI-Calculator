import React, { useRef, useState } from "react";
import {
  IonApp,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonRow,
  IonCol,
  IonGrid,
  IonLabel,
  IonInput,
  IonItem,
  IonAlert
} from "@ionic/react";
import BmiControls from "./components/BmiControls";
import BmiResults from "./components/BmiResults";
import InputControl from "./components/inputControl"
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

const App: React.FC = () => {
  // The data managed here is a number with <number>, react hook
  const [calculatedBmi, setCalculatedBmi] = useState<number>();
  const [error, setError] = useState<string>()
  const [calUnits, setCalUnits] = useState<'mkg' | 'ftlbs'>('mkg')
  // Generic type: Hold a ion input element, provided by ionic, react hook
  const weightInputRef = useRef<HTMLIonInputElement>(null);
  const heightInputRef = useRef<HTMLIonInputElement>(null);

  const calculateBMI = () => {
    // weightInputRef.current?.value => weightInputRef.current ? weightInputRef.current.value:null
    const enterWeight = weightInputRef.current?.value;
    // Never be null
    const enterHeight = heightInputRef.current!.value;

    if (
      !enterHeight ||
      !enterWeight ||
      +enterWeight <= 0 ||
      +enterHeight <= 0
    ) {
      setError("Please enter a valid (non-negative) number")
      return;
    }

    const weightConversionFactor = calUnits === 'ftlbs' ? 2.2:1;
    const heightConversionFactor = calUnits === 'ftlbs' ? 3.28:1;

    const weight  = +enterWeight / weightConversionFactor;
    const height = +enterHeight / heightConversionFactor;

    const bmi = +weight / (height * height);

    setCalculatedBmi(bmi);
  };
  const resetInputs = () => {
    // current? checks for  connection, value? checks for value
    // current! always has  connection, value! always has value
    weightInputRef.current!.value = "";
    heightInputRef.current!.value = "";
  };
  const clearError = () => {
    setError('')
  }

  const selectCalUnitHandler = (selectedValue: 'mkg' | 'ftlbs') => {
    setCalUnits(selectedValue);
  }
  return (
    <React.Fragment>

      <IonAlert isOpen={!!error} message={error} buttons={[{text:'Okay', handler: clearError}]}/>
    
    <IonApp>
      {/* header */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>BMI Calculator</IonTitle>
        </IonToolbar>
      </IonHeader>
      {/* content */}
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <InputControl selectedValue={calUnits} onSelectValue={selectCalUnitHandler}/>
            </IonCol>
          </IonRow>
          {/* First Row */}
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Your Height({calUnits === 'mkg' ? 'meters':'feet'})</IonLabel>
                <IonInput type="number" ref={heightInputRef}></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          {/* Second Row */}
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Your Weight({calUnits === 'mkg' ? 'kg':'lbs'})</IonLabel>
                <IonInput type="number" ref={weightInputRef}></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          {/* BmiControls Components */}
          {/* Passing 2 props to the components */}
          <BmiControls onCalculate={calculateBMI} onReset={resetInputs} />
          {calculatedBmi && <BmiResults result={calculatedBmi} />}
        </IonGrid>
      </IonContent>
    </IonApp>
    </React.Fragment>
  );
};

export default App;
