import { FinMath } from './FinMath'
import type { BankData } from './schemas'

type BankPostCalcResultOpts = {
    data: Record<string, BankData>,
    amount: number,
    taxRate: number,
    activeBank?: string
}

export default function BankPostCalcResult(opts: BankPostCalcResultOpts) {

    const showResultDetails = (data: BankData) => {
       const resultComponents = FinMath.calculateComponents(opts.amount, data.rate, 1, opts.taxRate);

       return (
            <div className="result-components">
                <div className="partial">
                    <b>Total with interest:</b>
                    <span>{resultComponents.combined.toFixed(2)} Kč</span>
                </div>
                <div className="partial">
                    <b>Interest:</b>
                    <span>{resultComponents.interest.toFixed(2)} Kč</span>
                </div>
                <div className="partial">
                    <b>Tax:</b>
                    <span>{resultComponents.tax.toFixed(2)} Kč</span>
                </div>
                <div className="spacer"></div>
                <div className="partial">
                    <b>Total after tax:</b>
                    <span>{resultComponents.combinedAfterTax.toFixed(2)} Kč</span>
                </div>
                <div className="partial">
                    <b>Interest after tax:</b>
                    <span>{resultComponents.interestAfterTax.toFixed(2)} Kč</span>
                </div>
            </div>
       )
    }

    return <>
        {Object.entries(opts.data)
            .sort(([, dataA], [, dataB]) => {
                const valueA = opts.amount >= dataA.min ? 
                    FinMath.calculateComponents(opts.amount, dataA.rate, 1, opts.taxRate).interestAfterTax : 0;
                const valueB = opts.amount >= dataB.min ? 
                    FinMath.calculateComponents(opts.amount, dataB.rate, 1, opts.taxRate).interestAfterTax : 0;
                return valueB - valueA;
            })
            .map(([name, data]) => (
            <div 
                key={name} 
                className={`bank-calc-res ${opts.amount < data.min ? 'disabled' : ''}`}
            >
                <img src={data.icon} alt={name}  style={{
                width: '100%',
                height: '95px',
                objectFit: "contain"
                }}/>
                <h3>{name}</h3>
                {opts.amount >= data.min ? showResultDetails(data) : (<>
                    <b>You have to depozit min <code>{data.min}Kč</code> </b>
                </>)}
            </div>
        ))}
    </>
};