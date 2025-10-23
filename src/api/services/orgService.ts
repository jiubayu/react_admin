import type {Organization} from '#/entity';
import apiClient from '../apiClient';

export enum OrgApi {
  Org = '/org',
}

const getOrgList = () => apiClient.get<Organization[]>({url: OrgApi.Org});

export default {getOrgList};
