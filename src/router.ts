// Generouted, changes to this file will be overridden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/:locale`
  | `/:locale/item/:id`
  | `/:locale/map`
  | `/:locale/progress`
  | `/:locale/settings`

export type Params = {
  '/:locale': { locale: string }
  '/:locale/item/:id': { locale: string; id: string }
  '/:locale/map': { locale: string }
  '/:locale/progress': { locale: string }
  '/:locale/settings': { locale: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
