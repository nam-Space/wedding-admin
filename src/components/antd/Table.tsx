/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ParamsType,
    ProTable,
    ProTableProps,
} from '@ant-design/pro-components';
import vi_VN from 'antd/locale/vi_VN';
import { Button, ConfigProvider, Popconfirm } from 'antd';

type DataTableProps<T extends Record<string, any>, U extends ParamsType = ParamsType, ValueType = 'text'> =
    ProTableProps<T, U, ValueType> & {
        handleDelete?: () => void;
    };

const DataTable = <
    T extends Record<string, any>,
    U extends ParamsType = ParamsType,
    ValueType = 'text',
>({
    columns,
    defaultData = [],
    dataSource,
    postData,
    pagination,
    // sticky = { offsetHeader: 50 },
    loading,
    rowKey = (record) => record.id,
    scroll,
    params,
    request,
    search,
    polling,
    toolBarRender,
    headerTitle,
    actionRef,
    dateFormatter = 'string',
    rowSelection,
    handleDelete = () => { },
}: DataTableProps<T, U, ValueType>) => {
    return (
        <ConfigProvider locale={vi_VN}>
            <ProTable<T, U, ValueType>
                columns={columns}
                defaultData={defaultData}
                dataSource={dataSource}
                postData={postData}
                pagination={pagination}
                bordered
                // sticky={sticky}
                loading={loading}
                rowKey={rowKey}
                scroll={scroll}
                params={params}
                request={request}
                search={search}
                polling={polling}
                toolBarRender={toolBarRender}
                headerTitle={headerTitle}
                actionRef={actionRef}
                dateFormatter={dateFormatter}
                rowSelection={rowSelection}
                tableAlertOptionRender={() => <Popconfirm
                    title="Bạn có chắc chắn muốn xóa?"
                    onConfirm={handleDelete}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Button danger>Xóa danh sách</Button>
                </Popconfirm>}
            />
        </ConfigProvider>
    );
};

export default DataTable;
