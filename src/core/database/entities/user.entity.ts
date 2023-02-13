import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid4 } from 'uuid';
import { GENDER, ROLE } from '../constant/user.constant';

@Entity({ name: 'user_profile' })
export class UserEntity extends BaseEntity {
  @PrimaryColumn({ name: 'user_id', length: 36, type: 'varchar' })
  id: string;

  @Column({ name: 'username', length: 20, type: 'varchar' })
  username: string;

  @Column({ name: 'mobile_no', length: 11, type: 'varchar', nullable: true })
  mobileNo: string;

  @Column({ unique: true, length: 320, type: 'varchar' })
  email: string;

  @Column({ name: 'password', length: 256, type: 'varchar' })
  password: string;

  @Column({ name: 'image_path', type: 'mediumtext', nullable: true })
  imagePath: string;

  @Column({
    type: 'enum',
    default: GENDER.NONE,
    enum: GENDER,
    name: 'gender',
  })
  gender: string;

  @Column({ name: 'birth_date', default: null })
  birthDate: Date;

  @Column({
    type: 'enum',
    default: ROLE.STUDENT,
    enum: ROLE,
    name: 'role',
  })
  role: string;

  @Column({ name: 'verify_email', type: 'boolean', default: false })
  verifyEmail: boolean;

  @CreateDateColumn({ name: 'create_date' })
  createDate: Date;

  @UpdateDateColumn({ name: 'update_date', nullable: true, default: null })
  updateDate: Date;

  @BeforeInsert()
  async generateId() {
    this.id = uuid4();
  }
}
