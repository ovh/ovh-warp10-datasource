export default class Warp10Datasource {
    id: number;
    orgId: number;
    isDefault: boolean;
    name: string;
    type: string;
    access: string;
    user: string;
    password: string;
    url: string;
    typeLogoUrl: string;
    basicAuth: boolean;
    basicAuthUser: string;
    basicAuthPassword: string;
    database: string;
    jsonData: any;
    secureJsonData: any;
    secureJsonFields: {};
    withCredentials: boolean;
}
