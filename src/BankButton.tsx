
type BankButtonOpts = {
    name: string,
    icon?: string,
    onClick: (name: string) => void,
    width?: number
}

export default function BankButton(opts: BankButtonOpts) {
    return (
        <button 
            style={{ 
                width: opts.width ? `${opts.width}px` : undefined 
            }} 
            key={opts.name} 
            type="button" 
            className="bank-btn"
             onClick={() => {opts.onClick(opts.name)}}
        >
            <img src={opts.icon} alt={opts.name}  style={{
                width: '100%',
                height: '95px',
                objectFit: "contain"
            }}/>
            <h3>{opts.name}</h3>
        </button>
    )
}