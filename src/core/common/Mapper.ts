interface Mapper<IN, OUT> {
    map(from: IN): OUT
}

export default Mapper