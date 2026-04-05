import { BulbOutlined, MoonOutlined } from '@ant-design/icons'
import { App as AntApp, ConfigProvider, Layout, Space, Switch, Typography, theme } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import { useEffect, useMemo, useState } from 'react'
import { OrdersPage } from './pages/orders-page/ui/OrdersPage'

const ruLocale = {
  ...ruRU,
  Pagination: {
    ...ruRU.Pagination,
    items_per_page: '/ стр.',
  },
}

function App() {
  const [isDarkTheme, setDarkTheme] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const appTheme = useMemo(
    () => ({
      algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: '#379DF1',
        colorInfo: '#379DF1',
        colorBgLayout: isDarkTheme ? '#0F1724' : '#EAF4FF',
        colorBgContainer: isDarkTheme ? '#182233' : '#F8FCFF',
        colorText: isDarkTheme ? '#E6F2FF' : '#1B2C40',
        colorBorder: isDarkTheme ? '#344A67' : '#BCD9F5',
        borderRadius: 14,
        fontFamily: 'Manrope, Segoe UI, sans-serif',
      },
    }),
    [isDarkTheme],
  )

  useEffect(() => {
    document.body.classList.toggle('theme-dark', isDarkTheme)
  }, [isDarkTheme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (event: MediaQueryListEvent): void => {
      setDarkTheme(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return (
    <ConfigProvider theme={appTheme} locale={ruLocale}>
      <AntApp>
        <Layout className="app-layout">
          <Layout.Header className="app-header">
            <Space className="app-header-content" align="center">
              <div>
                <Typography.Title level={3} className="app-title">
                  Панель управления заказами
                </Typography.Title>
                <Typography.Text className="app-subtitle">
                  Контроль заказов в реальном времени
                </Typography.Text>
              </div>
              <Space align="center">
                <BulbOutlined />
                <Switch
                  checked={isDarkTheme}
                  onChange={setDarkTheme}
                  checkedChildren={<MoonOutlined />}
                  unCheckedChildren={<BulbOutlined />}
                />
              </Space>
            </Space>
          </Layout.Header>
          <Layout.Content className="app-content">
            <OrdersPage />
          </Layout.Content>
        </Layout>
      </AntApp>
    </ConfigProvider>
  )
}

export default App
