export default function ResponseOptions(options: string[]) {

    return (
        <div>
            {options.map((op) => <div>{op}</div>)}
        </div>
    )
}