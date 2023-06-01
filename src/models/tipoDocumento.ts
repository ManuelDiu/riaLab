

export type TipoDocumento = {
    id: string | number | any,
    activo: boolean,
    nombre: string,
}

export type TipoDocumentoResponse = {
    list: TipoDocumento[],
    totalCount: number,
    totalPages: number,
    currentPage: number,
    offset: number,
    limit: number,
}

export type RemoveTIpoDocumentoResponse = {
    status: boolean,
    statusMessage: string,
    totalPages: number,
    entity: any,
}
