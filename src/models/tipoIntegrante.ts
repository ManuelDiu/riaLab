

export type TipoIntegrante = {
    id: string | number | any,
    activo: boolean,
    nombre: string,
    orden: number,
}

export type TipoIntegranteResponse = {
    list: TipoIntegrante[],
    totalCount: number,
    totalPages: number,
    currentPage: number,
    offset: number,
    limit: number,
}

export type RemoveTipoIntegranteResponse = {
    status: boolean,
    statusMessage: string,
    totalPages: number,
    entity: any,
}
