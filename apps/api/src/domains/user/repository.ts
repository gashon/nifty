import { injectable } from 'inversify';
import User, { UserDocument } from "@nifty/server-lib/models/user";
import { Model, Document, FilterQuery } from 'mongoose';
import { BaseRepository, IBaseRepository } from "../base/repository-factory";
import { IUserRepository, IUser } from './interfaces';
import { SearchKey } from "./types"

