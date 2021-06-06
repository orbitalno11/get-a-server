import { ApiProperty } from "@nestjs/swagger"
import { IPaginationLinks, IPaginationMeta } from "nestjs-typeorm-paginate"

class SearchResult<T> {
    @ApiProperty() item: Array<T>
    @ApiProperty() meta: IPaginationMeta
    @ApiProperty() links: IPaginationLinks
}

export default SearchResult