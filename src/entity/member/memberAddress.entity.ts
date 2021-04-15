import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm'
import {DistrictEntity} from '../contact/district.entity'
import {ProvinceEntity} from '../contact/province.entity'
import {SubDistrictEntity} from '../contact/subDistrict.entity'
import {MemberEntity} from './member.entitiy'

@Entity('member_address')
export class MemberAddressEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    address: string

    @Column()
    hintAddress: string | null

    @Column()
    road: string | null

    @Column({name: 'postCode'})
    postCode: string

    @Column()
    type: number

    @Column({name: "lat"})
    latitude: number

    @Column({name: "lng"})
    longitude: number

    // entity relation
    @ManyToOne(() => MemberEntity, (member) => member.memberAddress)
    member: MemberEntity

    @OneToOne(() => SubDistrictEntity)
    @JoinColumn({name: 'subdistrictId'})
    subDistrict: SubDistrictEntity

    @OneToOne(() => DistrictEntity)
    @JoinColumn({name: 'districtId'})
    district: DistrictEntity

    @OneToOne(() => ProvinceEntity)
    @JoinColumn({name: 'provinceId'})
    province: ProvinceEntity
}