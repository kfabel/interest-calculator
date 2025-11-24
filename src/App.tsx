import { useEffect, useState } from 'react';
import './App.css'
import EnvLoader from './DotEnv'
import type { BankData } from './schemas'
import { BanksDataSchema } from './schemas'
import BankButton from './BankButton';
import InvestRangeType from './InvestRangeType';
import BankPostCalcResult from './BankPostCalcResult';




function App() {

  const [bankData, setBankData] = useState<Record<string, BankData>>({});
  const [activeBank, setActiveBank] = useState<string|null>(null);
  const [shouldChooseBank, setShouldChooseBank] = useState<boolean>(true);
  const [inCalculation, setInCalculation] = useState<boolean>(false);
  const [investAmount, setInvestAmount] = useState<number>(0);
  const loader = new EnvLoader;

  useEffect(() => {
    fetchBankData();
  }, []);

  const taxRate: number = Number(loader.get<number>('TAX', -1));
  
  const fetchBankData = async () => {
    try {
      const source = loader.get<string>('BANKS', 'banks.json')
      const resp = await fetch(source || 'banks.json');
      const rawData = await resp.json();

      const validatedData = BanksDataSchema.parse(rawData);
      setBankData(validatedData);
    } catch (error) {
      console.error('Failed to fetch or validate bank data:', error);
    }
  };

  const switchBank = (name: string|null) => {
    setActiveBank(name);
    setInCalculation(true);
    setInvestAmount(0);
  };

  const startCalculation = () => {
    setInCalculation(true);
    setShouldChooseBank(false);
    console.log("in calc:", inCalculation);
    console.log("bank choice:", activeBank);
  }

  const showInvestInput = () => {
    return (
      <InvestRangeType 
        name="investRange" 
        label="Set the investment amount" 
        min={5_000}
        max={500_000}
        step={5000}
        onChange={
          (ref: React.RefObject<HTMLInputElement|null>) => 
            setInvestAmount(
              parseInt(ref.current?.value || '0')
            )
        }
      ></InvestRangeType>
    )
  };

  const showBankChoices = () => {
    return (
      <>
        {Object.entries(bankData).length > 0 ? (
          <>
            <div className='bank-select'>
              {Object.entries(bankData).map(([bankName, data]) => (
                <BankButton width={200} name={bankName} icon={data.icon} onClick={switchBank}></BankButton>
              ))}
            </div>
            <div>{showCalculateAll()}</div>
          </>
        ) : (
          <p>Loading bank data...</p>
        )}
      </>
    )
  }

  const showCalculateAll = () => {
    return (
      <>
        <button type="button" style={{marginTop: "36px"}} onClick={startCalculation}>Haven't decided yet</button>
      </>
    )
  }

  const displayCalculation = () => {
    if(!inCalculation)return;

    return (
      <div style={{minHeight: "700px"}}>
        {showInvestInput()}
        {investAmount > 0 ? (
            <div>
              <BankPostCalcResult data={(activeBank ? {[activeBank] : bankData[activeBank]} : bankData)} amount={investAmount} taxRate={taxRate}></BankPostCalcResult>
            </div>
          ) : (
          <>
            <p>You need to invest at least something!</p>
          </>
          )
        }
        <button type="button" onClick={() => {
            setInCalculation(false); 
            setActiveBank(null); 
            setShouldChooseBank(true);
        }}>Back</button>
      </div>
    )
  }


  return (
    <>
      
      {(shouldChooseBank && activeBank === null ) ? (
        <>
          <h1>Available Banks</h1>
          {showBankChoices()}
        </>
      ) : (
        <>
          <h1>{activeBank || "Calculating for all available banks"}</h1>
          {displayCalculation()}
        </>
      )}
    </>
  );
}

export default App
