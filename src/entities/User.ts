import { randomUUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  user_id: string;

  @Column({ nullable: false, type: "varchar", length: 255 })
  name: string;

  @Column({ nullable: false, type: "varchar", length: 255 })
  email: string;

  @Column({ nullable: false, type: "varchar", length: 32 })
  password: string;

  constructor(name: string, email: string, password: string) {
    this.user_id = randomUUID();
    this.email = email;
    this.name = name;
    this.password = password;
  }
}
