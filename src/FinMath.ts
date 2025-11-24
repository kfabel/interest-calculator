export class FinMath {
    private constructor() {}

    static compoundInterest(
        initialAmount: number, 
        rate: number, 
        compoundFrequency: number,
        duration: number
    ): number {
        return initialAmount * Math.pow((1 + rate / compoundFrequency), compoundFrequency * duration);
    }

    static simpleInterest(initialAmount: number, rate: number, time: number): number {
        return initialAmount * rate * time + initialAmount;
    }

    static applyTax(base: number, rate: number): {taxAmount : number, remainder: number} {
        
        const taxAmount: number = base * rate;
        const remainder: number = base * (1 - rate);

        return {
            taxAmount: taxAmount,
            remainder: remainder
        }
    }

    static calculateComponents(
        initialAmount: number, 
        rate: number, 
        time: number, 
        taxRate: number, 
        compound: boolean = false, 
        compoundFrequency: number = 1
    ): {
        combined: number,
        interest: number,
        tax: number,
        interestAfterTax: number,
        combinedAfterTax: number
    } {
        const combined = compound ? 
            FinMath.compoundInterest(initialAmount, rate, compoundFrequency, time) :
            FinMath.simpleInterest(initialAmount, rate, time)
        ;
        const interest = combined - initialAmount;
        const tax = FinMath.applyTax(interest, taxRate);

        return {
            combined: combined,
            interest: interest,
            tax: tax['taxAmount'],
            interestAfterTax: tax['remainder'],
            combinedAfterTax: combined - tax['taxAmount']
        }
    }
}