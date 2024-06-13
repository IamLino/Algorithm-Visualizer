export default function ComplexityDetail({title, value} : {
    title: string,
    value: string
}){
    return (
        <p className="flex w-full text-sm text-grey-500">
            <span className="w-28 ">{title}</span>
            <span>{value}</span>
        </p>
    );
}