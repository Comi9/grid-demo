import { cn } from '../lib/utils'

export const RowActionEdit = (params: any) => {
  const alignedGridApi = params.context.alignedGridRef.api

  const remove = () => {
    // const updatedRow = {
    //   ...params.data,
    //   action: params.data.action === 'delete' ? null : 'delete'
    // }
    // params?.api.applyTransaction({
    //   remove: [updatedRow]
    // })
    // params?.context.updateGrid()
    // console.log('remove')
    alignedGridApi.forEachNode((rowNode: any) => {
      if (params.data.id === rowNode.data.id && rowNode) {
        console.log(rowNode.data)
        alignedGridApi.applyTransaction({
          remove: [rowNode.data]
        })
        params?.context.updateGrid()
      }
    })
  }

  const copy = () => {
    console.log('copy')
  }

  const classNames = cn(
    'h-8 p-0 px-6 text-sm leading-6 border border-red-400',
    {
      'bg-green-100 text-black': params.data.action === 'insert'
    }
  )

  return (
    params.data.action !== 'delete' && (
      <div className='flex gap-2'>
        <button className={classNames} type='button' onClick={() => remove()}>
          x
        </button>
        <button className={classNames} type='button' onClick={() => copy()}>
          c
        </button>
      </div>
    )
  )
}
