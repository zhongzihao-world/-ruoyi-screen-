package com.ruoyi.screen.service;

import com.ruoyi.screen.domain.SysScreen;

import java.util.List;

public interface IScreenService {

    /**
     * 大屏列表
     * 
     * @param sysScreen
     * @return
     */
    public List<SysScreen> selectScreenList(SysScreen sysScreen);

    /**
     * 新增大屏
     * 
     * @param sysScreen
     * @return
     */
    public Long insertScreen(SysScreen sysScreen);

    /**
     * 批量删除大屏
     * 
     * @param screenId
     * @return
     */
    public int deleteScreenByScreenIds(Long[] screenIds);

    /**
     * 大屏详情
     * 
     * @param screenId
     * @return
     */
    public SysScreen selectScreenByScreenId(Long screenId);

    /**
     * 修改大屏
     * 
     * @param sysScreen
     * @return
     */
    public int updateScreen(SysScreen sysScreen);
}
