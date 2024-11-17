import { cn } from '../lib/utils'

export const RowActionDelete = (params: any) => {
  const buttonClicked = () => {
    const updatedRow = {
      ...params.data,
      action: params.data.action === 'delete' ? null : 'delete'
    }
    params?.api.applyTransaction({
      update: [updatedRow]
    })
    params?.context.updateGrid()
  }

  const classNames = cn(
    'h-8 p-0 px-6 text-sm leading-6 border border-red-400',
    {
      'bg-yellow-100 text-black': params.data.action === 'delete'
    }
  )

  return (
    <button
      className={classNames}
      type='button'
      onClick={() => buttonClicked()}>
      {params?.data.action === 'delete' ? 'Undo' : 'Delete'}
    </button>
  )
}
